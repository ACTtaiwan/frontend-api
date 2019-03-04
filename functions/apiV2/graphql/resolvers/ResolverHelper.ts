
import * as util from '../../util';
import * as rsvr from './ResolverRegistration';
import { APIClient } from './APIClient';
import * as _ from 'lodash';
import * as request from 'request';

export interface IIdObjectsFetcher {
  fetchObjects (ids: string[], queryFields: rsvr.ProjectionField): Promise<any[]>;
}

export interface IAssocFieldDescriptor {
  apiField?: string;            // GraphQL field -> association fields in backend API
  apiSubFields?: string[];       // GraphQL field -> association sub-fields in backend API
  fetcher?: IIdObjectsFetcher;  // association object fetcher
  isOneToOne?: boolean;         // is 1-to-1 association, default is 1-to-N
}

export interface IFieldsMappingDescriptor {
  readonly s3Fields: {[key: string]: string}; // GraphQL field -> fields in S3 Entity
  readonly assocFields: { [key: string]: IAssocFieldDescriptor };
  readonly gqlOnlyFields: string[]; // GraphQL-only fields. Never exists in backend API, DB, S3
}

export class ResolverHelper {
  private readonly logger = new util.Logger('ResolverHelper');

  public static processIdAndType (obj: any | any[]): any[] {
    const proc = (o: any) => {
      if (o._id) {
        o.id = o._id;
        delete o._id;
      }
      delete o._type;
      return o;
    };
    return _.isArray(obj) ? _.map(obj, o => proc(o)) : proc(obj);
  }

  constructor (
    private fieldsDesc: IFieldsMappingDescriptor
  ) {}

  public composeAPIQueryFields (gqlQueryFields: rsvr.ProjectionField ) {
    const desc = this.fieldsDesc;
    const apiFields = _.chain(gqlQueryFields.names)
      .filter(x => !_.includes(desc.gqlOnlyFields, x)) // filter out GraphQL-only fields
      .map(x => {
        // mapping association fields
        if (desc.assocFields[x] && desc.assocFields[x].apiField) {
          if (desc.assocFields[x].apiSubFields) {
            return [desc.assocFields[x].apiField as string, ...(desc.assocFields[x].apiSubFields as string[])];
          } else {
            return <string> desc.assocFields[x].apiField;
          }
        } else {
          return x;
        }
      })
      .map(x => _.includes(_.keys(desc.s3Fields), x) ? 's3Entity' : x) // mapping S3 fields
      .uniq()
      .value();
    return _.flatten(apiFields);
  }

  public async fetchObjects (ids: string[], queryFields: rsvr.ProjectionField): Promise<any[]> {
    const fLog = this.logger.in('fetchObjects');

    if (ids.length === 0) {
      return Promise.resolve([]);
    }

    const chunckedIds = _.chunk(ids, 20);
    const apiFields = this.composeAPIQueryFields(queryFields);
    const apiResult = await Promise.all(
      chunckedIds.map(idsSubset => APIClient.get('/v2', { id: idsSubset, field: apiFields }))
    );
    const apiObjs = ResolverHelper.processIdAndType(_.flatten(apiResult));
    let gqlObjs = await Promise.all(_.map(apiObjs, b => this.transformToGraphql(b, queryFields)));
    gqlObjs = this.sortResults(ids, gqlObjs);
    return Promise.resolve(gqlObjs);
  }

  private async transformToGraphql (apiObj: any, queryFields: rsvr.ProjectionField) {
    const fLog = this.logger.in('transformToGraphql');
    const gqlObj = _.cloneDeep(apiObj);
    await this.resolveS3Fields(apiObj, gqlObj, queryFields);
    this.resolveNameMapping(apiObj, gqlObj);
    await this.resolveAssociations(gqlObj, queryFields);
    return Promise.resolve(gqlObj);
  }

  private async resolveS3Fields (apiObj: any, gqlObj: any, queryFields: rsvr.ProjectionField) {
    // process S3 entity
    const fLog = this.logger.in('resolveS3Fields');
    const desc = this.fieldsDesc;
    const gqlS3Fields = _.intersection(queryFields.names, _.keys(desc.s3Fields));
    fLog.log(`gqlS3Fields = ${JSON.stringify(gqlS3Fields)}`);

    const s3QryFields = _.pick(desc.s3Fields, gqlS3Fields);
    fLog.log(`s3QryFields = ${JSON.stringify(s3QryFields)}`);

    if (!!apiObj.s3Entity) {
      const objExt = await new Promise((res, rej) =>
        request.get(apiObj.s3Entity, (error, response, body) =>
          !error ? res(JSON.parse(body)) : rej(error)
        )
      );
      _.each(s3QryFields, (val, key) => gqlObj[key] = objExt[val]);
      delete gqlObj.s3Entity;
    }
  }

  private resolveNameMapping (apiObj: any, gqlObj: any) {
    _.each(this.fieldsDesc.assocFields, (fieldDesc, gqlKey) => {
      // recover field names from api --> GraphQL
      const apiKey: string = fieldDesc.apiField || '';
      if (!!apiKey && apiObj[ apiKey ]) {
        gqlObj[ gqlKey ] = apiObj[ apiKey ];
        delete gqlObj[ apiKey ];
      }
    });
  }

  private async resolveAssociations (gqlObj: any, queryFields: rsvr.ProjectionField) {
    const fLog = this.logger.in('resolveAssociations');
    const desc = this.fieldsDesc;

    // process association fields
    const compQryFields = queryFields.compositeFieldNames;
    const assocFields = _.intersection(compQryFields, _.keys(desc.assocFields));
    const assocQryFields = _.pick(desc.assocFields, assocFields);
    if (_.isEmpty(assocQryFields)) {
      return;
    }

    // resolve sub-fields
    const promises = _.map(assocQryFields, async (fdesc, k) => {
      fLog.log(`processing field '${k}'`);
      if (fdesc.fetcher) {
        const projField = queryFields.getChild(k);
        if (!projField) {
          return Promise.reject(`Can not find project fields for ${k}. Current projection = ${JSON.stringify(queryFields, null, 2)}`);
        }

        const isOneToOne = fdesc.isOneToOne;
        const idx: string[] =  isOneToOne ? [ gqlObj[k] ] :  gqlObj[k];
        const objs = await fdesc.fetcher.fetchObjects(idx, projField);
        gqlObj[k] = isOneToOne ? _.head(objs) : objs;
      }
      return gqlObj;
    });
    await Promise.all(promises);
  }

  private sortResults (ids: string[], gqlObjs: any[]): any[] {
    let keyToGqlObj = _.keyBy(gqlObjs, 'id');
    let res: any[] = [];
    _.each(ids, id => res.push(keyToGqlObj[id]));
    return res;
  }
}
