import * as rsvr from './ResolverRegistration';
import { APIClient } from './APIClient';
import * as util from '../../util';
import { IIdObjectsFetcher, ResolverHelper } from './ResolverHelper';
import { TagResolver } from './TagResolver';
import { BillTypeResolver } from './BillTypeResolver';
import * as _ from 'lodash';
import { MemberResolver } from './MemberResolver';
import textVersionMeta from './TextVersionMeta';

interface IBillQuery {
  lang: string;
  ids: string[];
  congress: number[];
}

class CosponsorResolver extends MemberResolver {
  public fetchObjects (ids: string[], queryFields: rsvr.ProjectionField): Promise<any[]> {
    const qry = queryFields.compositeFields['member'];
    return super.fetchObjects(ids, qry);
  }
}

export class BillResolver implements rsvr.IResolverFunction<IBillQuery>, IIdObjectsFetcher {
  public readonly name: string = 'bills';
  public readonly type: rsvr.ResolveType = 'Query';

  private readonly logger = new util.Logger('BillResolver');
  private readonly helper = new ResolverHelper({
    s3Fields: {
      'summary': 'summaryLatest'
    },
    assocFields: {
      'sponsor': {
        apiField: 'sponsorIds',
        fetcher: new MemberResolver(),
        isOneToOne: true
      },
      'cosponsors': {
        apiField: 'cosponsorIds',
        apiSubFields: ['cosponsors#date'],
        fetcher: new CosponsorResolver()
      },
      'tags': {
        apiField: 'tagIds',
        fetcher: new TagResolver()
      },
      'billType': {
        fetcher: new BillTypeResolver(),
        isOneToOne: true
      }
    },
    gqlOnlyFields: ['prefetchIds', 'billCode']
  });

  public resolve ({lang, ids, congress}: IBillQuery, queryFields: rsvr.ProjectionField) {
    const fLog = this.logger.in('resolve');
    const isPrefetch = _.isEmpty(ids);

    fLog.log(`isPrefetch = ${isPrefetch}`);

    if (isPrefetch) {
      return this.prefetchIds({ congress });
    } else {
      return this.fetchObjects(ids, queryFields);
    }
  }

  private prefetchIds ({ congress }) {
    const fLog = this.logger.in('prefetchIds');
    if (_.isEmpty(congress)) {
      fLog.log('congress array is empty');
      return Promise.resolve([]);
    }

    return APIClient.get('/v2/bills', { congress })
      .then(response => {
        const result = { prefetchIds: _.map(response, x => x._id) };
        fLog.log(`result: ${JSON.stringify(result)}`);
        return Promise.resolve([result]);
      });
  }

  public async fetchObjects (ids: string[], queryFields: rsvr.ProjectionField): Promise<any[]> {
    const fLog = this.logger.in('fetchBills');

    // if querying 'billCode', then we need to query 'billType.display' && 'billNumber' field
    // and then post-generate billCode filed from them
    if (queryFields.hasField('billCode')) {
      const q = queryFields.compositeFields['billType'] || new rsvr.ProjectionField();
      q.setField('display');
      queryFields.setField('billType', q);
      queryFields.setField('billNumber');
    }

    fLog.log(`\nids = ${JSON.stringify(ids)}\nqueryFields = ${JSON.stringify(queryFields.toJSON())}`);
    let bills = await this.helper.fetchObjects(ids, queryFields);
    return this.processPostGenerateFields(bills, queryFields);
  }

  private processPostGenerateFields (bills: any[], queryFields: rsvr.ProjectionField): any[] {
    // generate billCode
    _.each(bills, b => {
      if (queryFields.hasPlainField('billCode') && !!b.billType) {
        b.billCode = `${b.billType.display} ${b.billNumber}`;
      }
    });

    // generate versions details
    _.each(bills, bill => {
      if (bill.versions && !_.isEmpty(bill.versions)) {
        _.each(bill.versions, ver => {
          ver = _.merge(ver, textVersionMeta[ver.code]);
        });
      }
    });

    // generate cosponsors
    _.each(bills, bill => {
      if (!_.isEmpty(bill.cosponsors) && !_.isEmpty(bill['cosponsors#date'])) {
        const m = _.keyBy(bill['cosponsors#date'], '_id');
        bill.cosponsors = _.map(bill.cosponsors, co => ({
          dateCosponsored: m[co.id].date,
          member: co
        }));
      }
    });
    return bills;
  }
}
