import axios from 'axios'
import awsConfig from '~/config/aws'

class CategoryResolver {
  constructor () {
    axios.defaults.baseURL = awsConfig.api.ENDPOINT
    this.getCategories = this.getCategories.bind(this)
    this.getCategory = this.getCategory.bind(this)
  }

  getCategories () {
    return axios({
      method: 'GET',
      url: '/billManagement/billCategories',
      headers: {}
    })
      .then(response => Promise.resolve(response.data))
      .catch(error => Promise.reject(error))
  }

  getCategory ({ memberId }) {
    return axios({
      method: 'GET',
      url: `/billManagement/billCategories/${memberId}`,
      headers: {}
    })
      .then(response => Promise.resolve(response.data))
      .catch(error => Promise.reject(error))
  }
}

export default CategoryResolver
