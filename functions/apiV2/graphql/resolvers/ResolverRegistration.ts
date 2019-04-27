import * as util from '../../util';
import { IResolvers, MergeInfo } from 'apollo-server-lambda';
import { GraphQLResolveInfo, FieldNode } from 'graphql';
import * as _ from 'lodash';
import { BillResolver } from './BillResolver';
import { MemberResolver } from './MemberResolver';
import { MapResolver } from './MapResolver';
import { ArticleResolver } from './ArticleResolver';
import { SubscribeResolver } from './SubscribeResolver';
import { DonateResolver } from './DonateResolver';

export type ResolveType = 'Query' | 'Mutation';
export type ResolveInfo = GraphQLResolveInfo & { mergeInfo: MergeInfo };

export interface IResolverFunction<T = any> {
  readonly name: string;
  readonly type: ResolveType;
  resolve (args: T, queryFields: ProjectionField): any;
}

export type CompositeField = {[compKey: string]: ProjectionField};

export class ProjectionField {
  constructor (
    private keys: (string | CompositeField)[] = []
  ) {
    this.keys = _.uniq(this.keys);
  }

  public get fields (): (string | CompositeField)[] {
    return this.keys;
  }

  public get names (): string [] {
    return _.flatten(_.map(this.keys, x => _.isString(x) ? x : _.keys(x)));
  }

  public get plainFields (): string[] {
    return <string[]> _.filter(this.keys, k => _.isString(k));
  }

  public get compositeFields (): CompositeField {
    const comp = <CompositeField[]> _.filter(this.keys, x => _.isObject(x));
    return _.merge({}, ...comp);
  }

  public get compositeFieldNames (): string[] {
    return _.keys(this.compositeFields);
  }

  public setField (key: string, field?: ProjectionField) {
    if (!field) {
      // plain field
      !this.hasField(key) && this.keys.push(key);
    } else {
      // composite field
      let child = <CompositeField> _.chain(this.keys)
        .filter(x => _.isObject(x))
        .find(x => !!x[key])
        .value();
      child
        ? child[key] = field
        : this.keys.push({ [key]: field });
    }
  }

  public hasField (key: string): boolean {
    return _.includes(this.names, key);
  }

  public hasPlainField (key: string): boolean {
    return _.includes(this.plainFields, key);
  }

  public hasCompositeField (key: string): boolean {
    return !!this.compositeFields[key];
  }

  public getChild (key: string): ProjectionField {
    const child = this.compositeFields[key];
    if (!!child) {
      return child;
    }
    throw new Error(`'${key}' is not a composition field`);
  }

  public toJSON (): any[] {
    const arr: any[] = this.plainFields;
    const comp = this.compositeFields;
    _.each(comp, (v, k) => {
      console.log(JSON.stringify(v));
      arr.push({ [k]: v.toJSON() });
    });
    return arr;
  }
}

export class ResolverRegistration {
  private static _resolvers: IResolvers;
  public static get resolvers (): IResolvers {
    if (!ResolverRegistration._resolvers) {
      ResolverRegistration._resolvers = {
        Query: {},
        Mutation: {}
      };
      ResolverRegistration.register(new BillResolver());
      ResolverRegistration.register(new MemberResolver());
      ResolverRegistration.register(new MapResolver());
      ResolverRegistration.register(new ArticleResolver());
      ResolverRegistration.register(new SubscribeResolver());
      ResolverRegistration.register(new DonateResolver());
    }
    return ResolverRegistration._resolvers;
  }

  private static register<T> (
    resolver: IResolverFunction<T>,
  ) {
    ResolverRegistration._resolvers[resolver.type][resolver.name] =
      (source, args: T, context, info: ResolveInfo): any => {
        const logger = new util.Logger('ResolverRegistration');
        const nLevels = ResolverRegistration.projectFields(info);
        logger.log(`[INCOMING] args = ${JSON.stringify(args, null, 2)}`);
        logger.log(`[INCOMING] N-level query fields = ${JSON.stringify(nLevels.toJSON(), null, 2)}`);
        // logger.log(`[INCOMING] info = ${JSON.stringify(info, null, 2)}`);
        return resolver.resolve(args, nLevels);
        // return [];
      };
  }

  private static projectFields (info: ResolveInfo): ProjectionField {
    if (info) {
      const root = <FieldNode> info.operation.selectionSet.selections[0];

      const getNameFieldMap = (nodes: FieldNode[]) => {
        let m = nodes
          .filter(field => field.name.value !== '__typename')
          .map(field => { return {[field.name.value]: field}; });
        return _.merge({}, ...m);
      };

      const buildProj = (root: FieldNode): ProjectionField => {
        const fields = <FieldNode[]> (root.selectionSet && root.selectionSet.selections) || [];
        const [composite, plain] = _.partition(fields, f => f.selectionSet && f.selectionSet.selections);
        const plainNames = _.keys(getNameFieldMap(plain));
        const compFieldMap = getNameFieldMap(composite);
        const compFields = _.keys(compFieldMap).map(k => { return {[k]: buildProj(compFieldMap[k])}; });
        return new ProjectionField([
          ...plainNames,
          ...compFields
        ]);
      };

      return buildProj(root);
    }
    throw new Error('info is missing');
  }
}

export default ResolverRegistration.resolvers;
