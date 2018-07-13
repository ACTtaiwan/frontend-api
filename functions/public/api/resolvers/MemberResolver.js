import axios from 'axios'
import awsConfig from '~/config/aws'
class MemberResolver {
  constructor () {
    axios.defaults.baseURL = awsConfig.api.ENDPOINT
    // graphQL fields map to dynamoDb and S3
    this.FIELDS_MAP = {
      caucus: { dynamoDb: 'caucus', s3: null },
      congressNumbers: { dynamoDb: 'congressNumbers', s3: null },
      createdAt: { dynamoDb: 'createdAt', s3: null },
      description: { dynamoDb: 'description', s3: null },
      district: { dynamoDb: 'district', s3: null },
      endDate: { dynamoDb: 'endDate', s3: null },
      id: { dynamoDb: 'id', s3: null },
      prefetchIds: { dynamoDb: null, s3: null },
      lastUpdatedAt: { dynamoDb: 'lastUpdatedAt', s3: null },
      office: { dynamoDb: 'office', s3: null },
      leadershipTitle: { dynamoDb: 'leadershipTitle', s3: null },
      phone: { dynamoDb: 'phone', s3: null },
      party: { dynamoDb: 'party', s3: null },
      person: { dynamoDb: 'person', s3: null },
      roleType: { dynamoDb: 'roleType', s3: null },
      roleTypeDisplay: { dynamoDb: 'roleTypeDisplay', s3: null },
      senatorClass: { dynamoDb: 'senatorClass', s3: null },
      senatorClassDisplay: { dynamoDb: 'senatorClassDisplay', s3: null },
      senatorRank: { dynamoDb: 'senatorRank', s3: null },
      senatorRankDisplay: { dynamoDb: 'senatorRankDisplay', s3: null },
      startDate: { dynamoDb: 'startDate', s3: null },
      state: { dynamoDb: 'state', s3: null },
      title: { dynamoDb: 'title', s3: null },
      titleLong: { dynamoDb: 'titleLong', s3: null },
      website: { dynamoDb: 'website', s3: null },
      billIdCosponsored: { dynamoDb: 'billIdCosponsored', s3: null },
      billIdSponsored: { dynamoDb: 'billIdSponsored', s3: null }
    }
    this.getMembers = this.getMembers.bind(this)
  }

  getMembers ({ ids = [], personIds = [], congress = [], states = [], queryFields = [] }) {
    let isPrefetch = ids.length === 0 && personIds.length === 0

    console.log('### MemberResolver.getMembers --> is prefetch?', isPrefetch)

    if (isPrefetch) {
      return this._prefetchIds({ congress, states })
    } else {
      return this._fetchMembers({ ids, personIds, queryFields })
    }
  }

  _prefetchIds ({ congress, states }) {
    if (congress.length === 0) {
      console.log('### MemberResolver._prefetchIds --> congress array is empty ')
      return Promise.resolve([])
    }

    return axios({
      method: 'GET',
      url: '/congressional/roles',
      params: {
        congress: congress.join(','),
        state: states.join(',')
      },
      headers: {}
    })
      .then(response => {
        console.log('++++++', JSON.stringify(response.data, null, 2))
        // TODO: change it back when the return is an array of role IDs
        const result = [{ prefetchIds: response.data.map(role => role.id) }]
        // const result = [{ prefetchIds: response.data }]
        console.log('### MemberResolver._prefetchIds --> result: ', result)
        return Promise.resolve(result)
      })
      .catch(error => Promise.reject(error))
  }

  _fetchMembers ({ ids, personIds, queryFields }) {
    let self = this

    if (ids.length > 0 && personIds > 0) {
      console.log('### MemberResolver._fetchMembers --> cannot provide ids & personIds at the same time ')
      return Promise.resolve([])
    }

    // break down the ids array when the length exceeds 100,
    // or aws api gateway can't take such a big request payload
    let chunck = 0
    const chunckSize = 100
    const itemIds = ids.length > 0 ? ids : personIds
    const itemIdName = ids.length > 0 ? 'id' : 'personId'
    const chunckedItemIds = []
    for (var i = 0; i < itemIds.length; i += chunckSize) {
      chunckedItemIds[chunck] = itemIds.slice(i, i + chunckSize)
      chunck++
    }

    return Promise.all(
      chunckedItemIds.map(itemIdsSubset => {
        let params = {}
        params[itemIdName] = itemIdsSubset.join(',')
        params['attrNamesToGet'] = this._mapQueryFieldsFromGraphqlToAws({ queryFields }).join(',')

        return axios({
          method: 'GET',
          url: '/congressional/roles',
          params,
          headers: {}
        })
      })
    )
      .then(result => {
        const members = result.reduce((accumulator, response) => {
          const data = response.data.map(member => self._mapBillFieldsFromAwsToGraphql({ member }))
          return [...accumulator, ...data]
        }, [])

        return Promise.resolve(members)
      })
      .catch(error => {
        console.log('XXX MemberResolver._fetchMembers --> error: ', error)
        return Promise.reject(error)
      })
  }

  _mapQueryFieldsFromGraphqlToAws ({ queryFields }) {
    let attributes = []
    let isQueryInfoInE3 = false

    queryFields.forEach(query => {
      // this data of this property resides in dynamoDb
      if (this.FIELDS_MAP[query].dynamoDb) {
        attributes.push(this.FIELDS_MAP[query].dynamoDb)
      }

      // this data of this property resides in s3
      if (this.FIELDS_MAP[query].s3) {
        isQueryInfoInE3 = true
      }
    })

    if (isQueryInfoInE3) {
      attributes.push('s3Entity')
    }

    console.log('### MemberResolver._mapQueryFieldsFromGraphqlToAws --> attributes: ', JSON.stringify(attributes, null, 2))
    return attributes
  }

  async _mapBillFieldsFromAwsToGraphql ({ member }) {
    let s3
    let normalizedMember = {}

    console.log('### MemberResolver._mapBillFieldsFromAwsToGraphql --> member: ', JSON.stringify(member, null, 2))

    // loop through all fields in graphql schema type
    // to see if they are in the result
    for (var property in this.FIELDS_MAP) {
      // the data of this property resides in dynamoDb
      let dynamoDbPropName = this.FIELDS_MAP[property].dynamoDb
      if (dynamoDbPropName && member.hasOwnProperty(dynamoDbPropName)) {
        // TODO: remove hardcoded conditional handling
        // if (dynamoDbPropName === 'billIdCosponsored' || dynamoDbPropName === 'billIdSponsored') {
        //   normalizedMember[property] = member[dynamoDbPropName].values ? member[dynamoDbPropName].values : member[dynamoDbPropName]
        // } else {
        normalizedMember[property] = member[dynamoDbPropName]
        // }
      }

      // the data of this property resides in s3
      let s3PropName = this.FIELDS_MAP[property].s3
      if (s3PropName && member.hasOwnProperty('s3Entity')) {
        if (!s3) {
          s3 = await axios(member.s3Entity)
          console.log('### MemberResolver._mapBillFieldsFromAwsToGraphql --> get s3 entity: ', JSON.stringify(s3.data, null, 2))
        }
        normalizedMember[property] = s3.data[s3PropName]
      }
    }

    console.log('### MemberResolver._mapBillFieldsFromAwsToGraphql --> normalized member: ', JSON.stringify(normalizedMember, null, 2))
    return normalizedMember
  }
}

export default MemberResolver
