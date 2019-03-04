import * as rsvr from './ResolverRegistration';
import * as util from '../../util';
import * as _ from 'lodash';
import { APIClient } from './APIClient';
import { ResolverHelper } from './ResolverHelper';

interface IArticleQuery {
  list: string;
  limit: number;
  before: string;
}

export class ArticleResolver implements  rsvr.IResolverFunction<IArticleQuery> {
  public readonly name: string = 'articles';
  public readonly type: rsvr.ResolveType = 'Query';

  private readonly logger = new util.Logger('ArticleResolver');

  public async resolve ({list = 'ustw', limit, before}: IArticleQuery, queryFields: rsvr.ProjectionField) {
    return APIClient.get(`/v2/article_snippets/${list}`, { limit, before, field: queryFields.names })
      .then(objs => ResolverHelper.processIdAndType(objs));
  }
}
