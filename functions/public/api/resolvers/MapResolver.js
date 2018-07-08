import axios from 'axios'
import awsConfig from '~/config/aws'
import AWS from 'aws-sdk'

class MapResolver {
  constructor () {
    axios.defaults.baseURL = awsConfig.api.ENDPOINT
    this.getCdMap = this.getCdMap.bind(this)
    this.getMapUtils = this.getMapUtils.bind(this)
    this.getStateList = this.getStateList.bind(this)
  }

  getCdMap ({ congress }) {
    let self = this

    return new Promise((resolve, reject) => {
      self
        ._getCd({ congress })
        .then(data => {
          resolve({ cdMap: data })
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  _getCd ({ congress }) {
    const s3 = new AWS.S3()
    const params = {
      Bucket: awsConfig.s3.STATIC_FILES_BUCKET_NAME,
      Key: `map/us-cd${congress}-topo.json`
    }

    return s3
      .getObject(params)
      .promise()
      .then(data => {
        console.log('get cd map success', data.Body.toString())
        return Promise.resolve(data.Body.toString())
      })
      .catch(error => {
        console.log('get cd map failed', error)
        return Promise.reject(error)
      })
  }

  getMapUtils () {
    let self = this
    return Promise.all([self._getUs(), self._getFipsToState(), self._getStateToFips()])
      .then(result => {
        return Promise.resolve({
          usMap: result[0],
          fipsToState: result[1],
          stateToFips: result[2]
        })
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }

  _getFipsToState () {
    const s3 = new AWS.S3()
    const params = {
      Bucket: awsConfig.s3.STATIC_FILES_BUCKET_NAME,
      Key: `map/fipsToState.json`
    }

    return s3
      .getObject(params)
      .promise()
      .then(data => {
        console.log('get fips to state success', data.Body.toString())
        return Promise.resolve(data.Body.toString())
      })
      .catch(error => {
        console.log('get fips to state failed', error)
        return Promise.reject(error)
      })
  }

  _getStateToFips () {
    const s3 = new AWS.S3()
    const params = {
      Bucket: awsConfig.s3.STATIC_FILES_BUCKET_NAME,
      Key: `map/stateToFips.json`
    }

    return s3
      .getObject(params)
      .promise()
      .then(data => {
        console.log('get state to fips success', data.Body.toString())
        return Promise.resolve(data.Body.toString())
      })
      .catch(error => {
        console.log('get state to fips failed', error)
        return Promise.reject(error)
      })
  }

  _getUs () {
    const s3 = new AWS.S3()
    const params = {
      Bucket: awsConfig.s3.STATIC_FILES_BUCKET_NAME,
      Key: `map/us.json`
    }

    return s3
      .getObject(params)
      .promise()
      .then(data => {
        console.log('get us map success', data.Body.toString())
        return Promise.resolve(data.Body.toString())
      })
      .catch(error => {
        console.log('get us map failed', error)
        return Promise.reject(error)
      })
  }

  getStateList () {
    let self = this

    return new Promise((resolve, reject) => {
      self
        ._getStateList()
        .then(data => {
          resolve({ states: data })
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  _getStateList () {
    const s3 = new AWS.S3()
    const params = {
      Bucket: awsConfig.s3.STATIC_FILES_BUCKET_NAME,
      Key: `map/stateCodeToName.json`
    }

    return s3
      .getObject(params)
      .promise()
      .then(data => {
        console.log('get state list success', data.Body.toString())
        return Promise.resolve(data.Body.toString())
      })
      .catch(error => {
        console.log('get state list failed', error)
        return Promise.reject(error)
      })
  }
}

export default MapResolver
