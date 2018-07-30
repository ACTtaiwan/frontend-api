import axios from 'axios'
import awsConfig from '~/config/aws'

class ArticleResolver {
  constructor () {
    axios.defaults.baseURL = awsConfig.api.ENDPOINT
    this.getArticles = this.getArticles.bind(this)
  }

  get _awsRegion () {
    return awsConfig.metadata.REGION
  }

  get _articlesTableName () {
    return awsConfig.dynamodb.ARTICLES_TABLE_NAME
  }

  getArticles ({ ids = [], list = 'ustw' }) {
    return axios({
      method: 'GET',
      url: `/articles/list/${list}`,
      headers: {}
    })
      .then(response => {
        const result = response.data
        console.log('### ArticleResolver --> result: ', result)
        return Promise.resolve(result)
      })
      .catch(error => Promise.reject(error))
  }
}

export default ArticleResolver
