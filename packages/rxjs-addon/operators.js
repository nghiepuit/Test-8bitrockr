import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/debounce'
import createLogger from 'debug'

window.createLogger = createLogger
const styleConsole = 'color: blue; text-shadow: 0 0 2px rgba(0,0,0,0.2);'
Observable.prototype.debug = function (namespace) {
  let source = this
  const log = createLogger('app:Observable:debug:' + namespace)
  return Observable.create(observer => {
    return source.subscribe(data => {
      log(`%c \n${JSON.stringify(data, null, 2)}\n`, styleConsole)
      observer.next(data)
    })
  })
}

// Add ofAction operator
Observable.prototype.ofAction = function (action) {
  return this.filter((item) => {
    const result = item.type === action.toString()
    return result
  })
}

// Add ofAction operator
Observable.prototype.end = function () {
  return this.filter(() => false)
}

