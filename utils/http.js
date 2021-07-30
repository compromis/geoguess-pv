import axios from 'axios'

export class API {
  constructor () {
    this.apiUrl = process.env.NUXT_ENV_SERVICES_URL
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    axios.defaults.headers.common['X-XSRF-TOKEN'] = ''
  }

  save (result) {
    this._call('post', 'save', result)
  }

  _call (method, path, params) {
    return new Promise((resolve, reject) => {
      axios[method](this.apiUrl + path, params).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error.response.data)
      })
    })
  }
}

export default new API()
