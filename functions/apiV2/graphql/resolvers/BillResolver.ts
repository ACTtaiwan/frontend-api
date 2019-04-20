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
  public fetchObjects (ids: string[], queryFields: rsvr.ProjectionField, lang?: string): Promise<any[]> {
    const qry = queryFields.compositeFields['member'];
    return super.fetchObjects(ids, qry, lang);
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
    gqlOnlyFields: ['prefetchIds', 'billCode'],
    remappedFields: {
      'gist': 'summary'
    }
  });

  public resolve ({lang, ids, congress}: IBillQuery, queryFields: rsvr.ProjectionField) {
    const fLog = this.logger.in('resolve');
    const isPrefetch = _.isEmpty(ids);

    fLog.log(`isPrefetch = ${isPrefetch}`);

    if (isPrefetch) {
      return this.prefetchIds({ congress });
    } else {
      return this.fetchObjects(ids, queryFields, lang);
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

  public async fetchObjects (ids: string[], queryFields: rsvr.ProjectionField, lang?: string): Promise<any[]> {
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
    let bills = await this.helper.fetchObjects(ids, queryFields, lang);
    return this.processPostGenerateFields(bills, queryFields, lang);
  }

  private processPostGenerateFields (bills: any[], queryFields: rsvr.ProjectionField, lang?: string): any[] {
    // generate billCode
    _.each(bills, b => {
      if (queryFields.hasPlainField('billCode') && !!b.billType) {
        b.billCode = `${b.billType.display} ${b.billNumber}`;
      }
    });

    // generate versions details
    const i18nCode = (!!lang && lang.startsWith('zh')) ? 'zh' : 'en';
    _.each(bills, bill => {
      if (bill.versions && !_.isEmpty(bill.versions)) {
        _.each(bill.versions, ver => {
          let obj = textVersionMeta[ver.code];
          ver = _.merge(ver, {
            chamber: obj.chamber,
            code: obj.code,
            name: obj[i18nCode].name,
            description: obj[i18nCode].description
          });
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
