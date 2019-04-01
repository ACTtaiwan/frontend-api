
import billTypeMeta from './BillTypeMeta';
import { IIdObjectsFetcher } from './ResolverHelper';
import * as rsvr from './ResolverRegistration';
import * as _ from 'lodash';

export class BillTypeResolver implements IIdObjectsFetcher {
  public fetchObjects (ids: string[], queryFields: rsvr.ProjectionField, lang?: string): Promise<any[]> {
    const fields = queryFields.plainFields;
    const objs = _.map(ids, k => _.pick(billTypeMeta[k], fields));
    return Promise.resolve(objs);
  }
}
