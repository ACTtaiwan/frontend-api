import axios from 'axios'
import awsConfig from '~/config/aws'

class SubscribeResolver {
  constructor () {
    axios.defaults.baseURL = awsConfig.api.ENDPOINT
    this.subscribe = this.subscribe.bind(this)
  }

  subscribe (inputs) {
    let request = {
      method: 'POST',
      url: `/subscribe/newsletter`,
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.BACKEND_API_KEY
      },
      data: inputs,
      body: JSON.stringify(inputs)
    }

    console.log('### SubscribeResolver --> request: ', request)

    return axios(request)
      .then(response => {
        const result = response.data
        console.log('### SubscribeResolver --> result: ', result)
        return true
      })
      .catch(error => Promise.reject(error))
  }
}

export default SubscribeResolver
