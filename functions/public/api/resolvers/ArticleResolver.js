import AWS from 'aws-sdk'
import awsConfig from '~/config/aws'

class ArticleResolver {
  constructor () {
    this.getArticles = this.getArticles.bind(this)
    this.dynamoDb = new AWS.DynamoDB.DocumentClient({
      region: this._awsRegion
    })
  }

  get _awsRegion () {
    return awsConfig.metadata.REGION
  }

  get _articlesTableName () {
    return awsConfig.dynamodb.ARTICLES_TABLE_NAME
  }

  getArticles ({ ids = [], sources = [], queryFields = [] }) {
    let isPrefetch = ids.length === 0

    console.log('### ArticleResolver.getArticles --> is prefetch?', isPrefetch)

    // TODO: handle prefetch case

    // if (isPrefetch) {
    //   return this._prefetchIds({ sources })
    // } else {
    //   return this._fetchArticles({ ids, queryFields })
    // }

    return this._prefetchIds({ sources })
  }

  _prefetchIds ({ sources }) {
    const params = {
      TableName: this._articlesTableName
    }

    return this.dynamoDb
      .scan(params)
      .promise()
      .then(data => Promise.resolve(data.Items))
      .catch(error => Promise.reject(error))
  }

  _fetchArticles ({ ids, queryFields }) {
    const keys = ids.map(id => ({ id: id }))
    const itemsMap = {}
    itemsMap[this._articlesTableName] = { Keys: keys }
    const params = { RequestItems: itemsMap }

    console.log('### ArticleResolver._fetchArticles --> params?', params)

    return new Promise((resolve, reject) => {
      this.dynamoDb.batchGet(params, (err, data) => (err ? reject(err) : resolve(data)))
    })
  }
}

export default ArticleResolver
