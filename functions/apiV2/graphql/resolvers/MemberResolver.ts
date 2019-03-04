import { IIdObjectsFetcher, ResolverHelper } from './ResolverHelper';
import { APIClient } from './APIClient';
import * as util from '../../util';
import * as rsvr from './ResolverRegistration';
import * as _ from 'lodash';

interface IMemberQuery {
  lang: string;
  ids: string[];
  congress: number[];
  states: string[];
}

export class MemberResolver implements  rsvr.IResolverFunction<IMemberQuery>, IIdObjectsFetcher {
  public readonly name: string = 'members';
  public readonly type: rsvr.ResolveType = 'Query';

  private readonly logger = new util.Logger('MemberResolver');
  private readonly helper = new ResolverHelper({
    s3Fields: {},
    gqlOnlyFields: [],
    assocFields: {
      'billIdSponsored': {
        apiField: 'sponsoredBillIds'
      },
      'billIdCosponsored': {
        apiField: 'cosponsoredBillIds'
      },
      'cosponsorProperty': {
        apiField: 'cosponsoredBills#date'
      }
    }
  });

  public resolve ({lang, ids, congress, states}: IMemberQuery, queryFields: rsvr.ProjectionField) {
    const fLog = this.logger.in('resolve');
    const isPrefetch = _.isEmpty(ids);

    fLog.log(`isPrefetch = ${isPrefetch}`);

    if (isPrefetch) {
      return this.prefetchIds({ congress, states });
    } else {
      return this.fetchObjects(ids, queryFields);
    }
  }

  private prefetchIds ({ congress, states }: Partial<IMemberQuery>) {
    const fLog = this.logger.in('prefetchIds');
    if (_.isEmpty(congress)) {
      fLog.log('congress array is empty');
      return Promise.resolve([]);
    }

    return APIClient.get('/v2/persons', { congress, state: states || [], field: ['congressRoles'] })
      .then(response => {
        const sorted = this.sortAndFilter(response);
        const result = { prefetchIds: _.map(sorted, x => x._id) };
        fLog.log(`result: ${JSON.stringify(result)}`);
        return Promise.resolve([result]);
      });
  }

  public async fetchObjects (ids: string[], queryFields: rsvr.ProjectionField): Promise<any[]> {
    const fLog = this.logger.in('fetchObjects');
    fLog.log(`\nids = ${JSON.stringify(ids)}\nqueryFields = ${JSON.stringify(queryFields.toJSON())}`);

    // if querying currentRole OR latestRole, then we need to query all congressRoles
    // and then post-generate the current role from all role entities
    if (queryFields.hasField('currentRole') || queryFields.hasField('latestRole')) {
      const qryRole = new rsvr.ProjectionField([
        'congressNumbers',
        'chamber',
        'startDate',
        'endDate',
        'party',
        'state',
        'district',
        'senatorClass',
        'title',
        'titleLong',
        'roleTypeDisplay',
        'senatorClassDisplay'
      ]);
      queryFields.setField('congressRoles', qryRole);
    }

    let members = await this.helper.fetchObjects(ids, queryFields);
    members && (members = _.filter(members, m => m));
    return this.processPostGenerateFields(members, queryFields);
  }

  private processPostGenerateFields (members: any[], queryFields: rsvr.ProjectionField): any[] {
    const delegateStates = new Set(['MP', 'GU', 'AS', 'VI', 'PI', 'DK', 'DC']);

    // generate roleTypeDisplay, title, titleLong, senatorClassDisplay for roles
    _.each(members, m => {
      if (m && m.congressRoles) {
        _.each(m.congressRoles, r => {
          if (r.chamber === 'h') {
            r.roleTypeDisplay = 'Representative';

            if (r.state === 'PR') {
              r.titleLong = 'Resident Commissioner';
              r.title = 'Commish.';
            } else if (delegateStates.has(r.state)) {
              r.titleLong = 'Delegate';
              r.title = 'Rep.';
            } else {
              r.titleLong = 'Representative';
              r.title = 'Rep.';
            }
          }

          if (r.chamber === 's') {
            r.roleTypeDisplay = 'Senator';
            r.titleLong = 'Senator';
            r.title = 'Sen.';
            r.senatorClassDisplay = `Class ${r.senatorClass}`;
          }
        });
      }
    });

    // remapping ProfilePicture field names
    _.each(members, m => {
      const obj = m.profilePictures;
      if (obj) {
        obj.tiny = obj['50px'];
        obj.small = obj['100px'];
        obj.medium = obj['200px'];
        obj.original = obj['origin'];
      }
    });

    // remapping cosponsorProperty field names
    _.each(members, m => {
      if (m.cosponsorProperty) {
        _.each(m.cosponsorProperty, obj => {
          obj.billId = obj._id;
          obj.dateCosponsored = obj.date;
          delete obj._id;
          delete obj.date;
        });
      }
    });

    // generate currentRole && latestRole
    const now = new Date().getTime();
    _.each(members, m => {
      if (m.congressRoles) {
        const sortCngrRoles = _.orderBy(m.congressRoles, 'endDate', 'desc');
        const latest = _.head(sortCngrRoles);

        if (queryFields.hasField('latestRole')) {
          m.latestRole = _.cloneDeep(latest);
        }

        if (queryFields.hasField('currentRole') && latest && latest.endDate >= now) {
          m.currentRole = _.cloneDeep(latest);
        }
      }
    });


    return members;
  }

  private sortAndFilter (members: any[]): any[] {
    _.each(members, m => {
      if (m.congressRoles) {
        const sortCngrRoles = _.orderBy(m.congressRoles, 'endDate', 'desc');
        const latest = _.head(sortCngrRoles);
        m.latestRole = _.cloneDeep(latest);
      }
    });

    return _.orderBy(members,
      [(role) => role.latestRole.state, (role) => role.latestRole.district || 0, (role) => role.latestRole.senatorClass],
      ['asc', 'asc', 'asc']);
  }
}
