import _ from 'lodash'
import axios from 'axios'
import awsConfig from '~/config/aws'
class BillResolver {
  constructor () {
    axios.defaults.baseURL = awsConfig.api.ENDPOINT
    // graphQL fields map to dynamoDb and S3
    this.FIELDS_MAP = {
      congress: { dynamoDb: 'congress', s3: null },
      actions: { dynamoDb: 'actions', s3: null },
      actionsAll: { dynamoDb: 'actionsAll', s3: null },
      billType: { dynamoDb: 'billType', s3: null },
      id: { dynamoDb: 'id', s3: null },
      prefetchIds: { dynamoDb: null, s3: null },
      introducedDate: { dynamoDb: 'introducedDate', s3: null },
      lastUpdated: { dynamoDb: 'lastUpdated', s3: null },
      sponsor: { dynamoDb: 'sponsor', s3: null },
      categories: { dynamoDb: 'categories', s3: null },
      cosponsors: { dynamoDb: 'cosponsors', s3: null },
      title: { dynamoDb: 'title', s3: null },
      billNumber: { dynamoDb: 'billNumber', s3: null },
      billCode: { dynamoDb: null, s3: null },
      versions: { dynamoDb: 'versions', s3: null },
      trackers: { dynamoDb: 'trackers', s3: null },
      summary: { dynamoDb: null, s3: 'summaryLatest' },
      articles: { dynamoDb: 'articles', s3: null }
    }
    this.getBills = this.getBills.bind(this)
  }

  getBills ({ ids = [], congress = [], categories = [], queryFields = [] }) {
    let isPrefetch = ids.length === 0

    console.log('### BillResolver.getBills --> is prefetch?', isPrefetch)

    if (isPrefetch) {
      return this._prefetchIds({
        congress,
        categories
      })
    } else {
      return this._fetchBills({ ids, queryFields })
    }
  }

  _prefetchIds ({ congress, categories }) {
    if (congress.length === 0) {
      console.log('### BillResolver._prefetchIds --> congress array is empty ')
      return Promise.resolve([])
    }

    return axios({
      method: 'GET',
      url: '/congressional/bills',
      params: {
        congress: congress.join(','),
        categoryIdx: categories.join(',')
      },
      headers: {}
    })
      .then(response => {
        const result = [{ prefetchIds: response.data }]
        console.log('### BillResolver._prefetchIds --> result: ', result)
        return Promise.resolve(result)
      })
      .catch(error => Promise.reject(error))
  }

  _fetchBills ({ ids, queryFields }) {
    let self = this

    if (ids.length === 0) {
      console.log('### BillResolver._fetchBills --> ids array is empty ')
      return Promise.resolve([])
    }

    console.log('### BillResolver._fetchBills --> the length of ids is: ', ids.length)

    // break down the ids array when the length exceeds 20,
    // or aws api gateway can't take such a big request payload.
    let chunck = 0
    const chunckSize = 20
    const chunckedIds = []
    for (var i = 0; i < ids.length; i += chunckSize) {
      chunckedIds[chunck] = ids.slice(i, i + chunckSize)
      chunck++
    }

    return Promise.all(
      chunckedIds.map(idsSubset => {
        return axios({
          method: 'GET',
          url: '/congressional/bills',
          params: {
            id: idsSubset.join(','),
            attrNamesToGet: this._mapQueryFieldsFromGraphqlToAws({ queryFields }).join(',')
          },
          headers: {}
        })
      })
    )
      .then(result => {
        // flatten the result
        const bills = result.reduce((accumulator, response) => {
          return [...accumulator, ...response.data]
        }, [])
        // dynamoDb doesn't return result based on the order of provided bill ids
        // therefore, need to sort the bills based on the order of ids
        const billsMap = _.keyBy(bills, 'id')
        const sortedBills = ids.map(id => billsMap[id])
        // some fields might require queries to other systems
        const hydratedBills = sortedBills.map(bill => self._mapBillFieldsFromAwsToGraphql({ bill }))

        return Promise.resolve(hydratedBills)
      })
      .catch(error => {
        console.log('XXX BillResolver._fetchBills --> error: ', error)
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

    console.log('### BillResolver._mapQueryFieldsFromGraphqlToAws --> attributes: ', JSON.stringify(attributes, null, 2))
    return attributes
  }

  async _mapBillFieldsFromAwsToGraphql ({ bill }) {
    let s3
    let normalizedBill = {}

    // loop through all fields in graphql schema type
    // to see if they are in the result
    for (var property in this.FIELDS_MAP) {
      // the data of this property resides in dynamoDb
      let dynamoDbPropName = this.FIELDS_MAP[property].dynamoDb
      if (dynamoDbPropName && bill.hasOwnProperty(dynamoDbPropName)) {
        normalizedBill[property] = bill[dynamoDbPropName]
      }

      // the data of this property resides in s3
      let s3PropName = this.FIELDS_MAP[property].s3
      if (s3PropName && bill.hasOwnProperty('s3Entity')) {
        if (!s3) {
          s3 = await axios(bill.s3Entity)
          console.log('### BillResolver._mapBillFieldsFromAwsToGraphql --> get s3 entity: ', JSON.stringify(s3.data, null, 2))
        }
        normalizedBill[property] = s3.data[s3PropName]
      }
    }

    console.log('### BillResolver._mapBillFieldsFromAwsToGraphql --> normalized bill: ', JSON.stringify(normalizedBill, null, 2))
    return normalizedBill
  }
}

export default BillResolver
