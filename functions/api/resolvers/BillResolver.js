import _ from 'lodash'
import axios from 'axios'
import awsConfig from '~/config/aws'
class BillResolver {
  constructor () {
    axios.defaults.baseURL = awsConfig.api.ENDPOINT
    // graphQL fields map to Azure and S3
    this.FIELDS_MAP = {
      congress: { azure: 'congress', s3: null },
      actions: { azure: 'actions', s3: null },
      actionsAll: { azure: 'actionsAll', s3: null },
      billType: { azure: 'billType', s3: null },
      id: { azure: 'id', s3: null },
      prefetchIds: { azure: null, s3: null },
      introducedDate: { azure: 'introducedDate', s3: null },
      lastUpdated: { azure: 'lastUpdated', s3: null },
      sponsor: { azure: 'sponsor', s3: null },
      categories: { azure: 'categories', s3: null },
      tags: { azure: 'tags', s3: null },
      cosponsors: { azure: 'cosponsors', s3: null },
      title: { azure: 'title', s3: null },
      billNumber: { azure: 'billNumber', s3: null },
      billCode: { azure: null, s3: null },
      versions: { azure: 'versions', s3: null },
      trackers: { azure: 'trackers', s3: null },
      summary: { azure: null, s3: 'summaryLatest' },
      articles: { azure: 'articles', s3: null }
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
            attrNamesToGet: this._mapQueryFieldsFromGraphqlToAzure({ queryFields }).join(',')
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
        // Azure doesn't return result based on the order of provided bill ids
        // therefore, need to sort the bills based on the order of ids
        const billsMap = _.keyBy(bills, 'id')
        const sortedBills = ids.map(id => billsMap[id])
        // some fields might require queries to other systems
        const hydratedBills = sortedBills.map(bill =>
          self._mapBillFieldsFromAzureToGraphql({ bill })
        )

        return Promise.resolve(hydratedBills)
      })
      .catch(error => {
        console.log('XXX BillResolver._fetchBills --> error: ', error)
        return Promise.reject(error)
      })
  }

  _mapQueryFieldsFromGraphqlToAzure ({ queryFields }) {
    let attributes = []
    let isQueryInfoInE3 = false

    queryFields.forEach(query => {
      // this data of this property resides in Azure
      if (this.FIELDS_MAP[query].azure) {
        attributes.push(this.FIELDS_MAP[query].azure)
      }

      // this data of this property resides in s3
      if (this.FIELDS_MAP[query].s3) {
        isQueryInfoInE3 = true
      }
    })

    if (isQueryInfoInE3) {
      attributes.push('s3Entity')
    }

    console.log(
      '### BillResolver._mapQueryFieldsFromGraphqlToAzure --> attributes: ',
      JSON.stringify(attributes, null, 2)
    )
    return attributes
  }

  async _mapBillFieldsFromAzureToGraphql ({ bill }) {
    let s3
    let normalizedBill = {}

    // loop through all fields in graphql schema type
    // to see if they are in the result
    for (var property in this.FIELDS_MAP) {
      // the data of this property resides in Azure
      let azurePropName = this.FIELDS_MAP[property].azure
      if (azurePropName && bill.hasOwnProperty(azurePropName)) {
        normalizedBill[property] = bill[azurePropName]
      }

      // the data of this property resides in s3
      let s3PropName = this.FIELDS_MAP[property].s3
      if (s3PropName && bill.hasOwnProperty('s3Entity')) {
        if (!s3) {
          s3 = await axios(bill.s3Entity)
          console.log(
            '### BillResolver._mapBillFieldsFromAzureToGraphql --> get s3 entity: ',
            JSON.stringify(s3.data, null, 2)
          )
        }
        normalizedBill[property] = s3.data[s3PropName]
      }
    }

    console.log(
      '### BillResolver._mapBillFieldsFromAzureToGraphql --> normalized bill: ',
      JSON.stringify(normalizedBill, null, 2)
    )
    return normalizedBill
  }
}

export default BillResolver
