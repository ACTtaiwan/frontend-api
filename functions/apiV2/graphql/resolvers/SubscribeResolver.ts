import * as rsvr from './ResolverRegistration';
import * as util from '../../util';
import { APIClient } from './APIClient';

interface ISubscribeQuery {
  inputs: {
    email: string;
    name: string;
    list: 'ustw' | 'act';
  };
}

export class SubscribeResolver implements  rsvr.IResolverFunction<ISubscribeQuery> {
  public readonly name: string = 'subscribe';
  public readonly type: rsvr.ResolveType = 'Mutation';
  private readonly logger = new util.Logger('SubscribeResolver');

  public resolve ({ inputs }: ISubscribeQuery, queryFields: rsvr.ProjectionField) {
    const fLog = this.logger.in('resolve');
    return APIClient.post('/subscribe/newsletter', { ...inputs })
      .then(() => true)
      .catch(() => false);
  }
}
