import { Observable } from 'rxjs/Observable'
import { resolve } from 'url'
import * as _ from 'bluebird'
import r2 from 'r2'
import * as ls from 'local-storage'
const log = createLogger('app:services:http')

export default class CallApi {

  _unauthorizedClient = null
  _client = null
  _endPoint = null
  _token = null
  _url = null

  static getInstance() {
    const token = ls('token')
    if (!token && !this._unauthorizedClient) this._unauthorizedClient = new CallApi({})
    if (!token) return this._unauthorizedClient
    if (!this._client || this._token !== token ) this._client = new CallApi({ token })
    this._token = token
    return this._client
  }

  constructor({ token }) {
    this._endPoint = `${process.env.BACKEND_PROTOCOL}://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT || 80}`
    this._token = token
  }

  createHeaders() {
    if (this._token) {
      log('Header with JWT')
      return {
        'Authorization': `${this._token}`,
      }
    }

    log('Header without JWT')
    return {}
  }

  createUrl(path = '') {
    return resolve(this._endPoint, path)
  }

  to(path) {
    this._url = this.createUrl(path)
    return this
  }

  async asyncPost(payload) {
    try {
      return await r2.post(this._url, {
        json: payload,
        headers: this.createHeaders(),
      }).json
    } catch (err) {
      log(`%c ERROR: async asyncPost(payload) ==> ${JSON.stringify(err)}`, 'text-shadow: 0 0 2 red;')
      throw new Error(err)
    }
  }

  async asyncPut(payload) {
    try {
      return await r2.put(this._url, {
        json: payload,
        headers: this.createHeaders(),
      }).json
    } catch (err) {
      log(`%c ERROR: async asyncPost(payload) ==> ${JSON.stringify(err)}`, 'text-shadow: 0 0 2 red;')
      throw new Error(err)
    }
  }

  async asyncDelete(payload) {
    try {
      return await r2.delete(this._url, {
        json: payload,
        headers: this.createHeaders(),
      }).json
    } catch (err) {
      log(`%c ERROR: async asyncDelete(payload) ==> ${JSON.stringify(err)}`, 'text-shadow: 0 0 2 red;')
      throw new Error(err)
    }
  }

  async asyncPostFile(fileName, file, fileContent) {
    try {
      const sendXHRRequest = () => {
        return new Promise((done, fail) => {
          const request = new XMLHttpRequest()
          const form = new FormData()
          form.append('file', file, fileName)
          request.open('POST', this._url)
          request.setRequestHeader('Authorization', `JWT ${this._token}`)
          request.send(form)
          request.onload = () => {
            if (request.status !== 200) {
              fail(request.response)
            } else {
              done(request.response)
            }
          }
          request.onerror = () => {
            fail(request.response)
          }
        })
      }
      log('sendXHRRequest')
      const res = await sendXHRRequest()
      return res
    } catch (err) {
      err && err.stack && log(err.stack)
      err && err.message && log(err.message)
      throw err
    }
  }

  async asyncGet() {
    try {
      return await r2.get(this._url, {
        headers: this.createHeaders(),
      }).json
    } catch (err) {
      throw new Error(err)
    }
  }

  async handleError(err) {
  }

  post = (payload) => Observable.fromPromise(this.asyncPost(payload))
  get = (payload) => Observable.fromPromise(this.asyncGet())

}

