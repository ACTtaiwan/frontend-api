import axios from 'axios'
import awsConfig from '~/config/aws'
import * as _ from 'lodash'

class ArticleResolver {
  constructor () {
    axios.defaults.baseURL = awsConfig.api.ENDPOINT
    this.getArticles = this.getArticles.bind(this)
  }

  getArticles ({ list = 'ustw', limit, before }) {
    let qsp = this._createQSP({ limit, before })
    let url = `/articles/list/${list}` + qsp
    console.log('### ArticleResolver --> URL: ', url)
    return axios({
      method: 'GET',
      url,
      headers: {}
    })
      .then(response => {
        const result = response.data
        console.log('### ArticleResolver --> result: ', result)
        return Promise.resolve(result)
      })
      .catch(error => Promise.reject(error))
  }

  _createQSP (params) {
    console.log('### ArticleResolver --> params: ', params)
    if (_.isEmpty(params)) {
      return ''
    } else {
      let kvPair = []
      _.forEach(params, (val, key) => {
        !!val && kvPair.push(`${key}=${encodeURIComponent(val)}`)
      })
      return '?' + kvPair.join('&')
    }
  }
}

export default ArticleResolver
