import { IIdObjectsFetcher, ResolverHelper } from './ResolverHelper';
import * as util from '../../util';
import * as rsvr from './ResolverRegistration';

export class TagResolver implements IIdObjectsFetcher {
  private readonly logger = new util.Logger('TagResolver');
  private readonly helper = new ResolverHelper({
    s3Fields: {},
    gqlOnlyFields: [],
    assocFields: {
      'tag': {
        apiField: 'name'
      }
    }
  });

  public async fetchObjects (ids: string[], queryFields: rsvr.ProjectionField): Promise<any[]> {
    const fLog = this.logger.in('fetchObjects');
    fLog.log(`\nids = ${JSON.stringify(ids)}\nqueryFields = ${JSON.stringify(queryFields.toJSON())}`);
    return await this.helper.fetchObjects(ids, queryFields);
  }
}
