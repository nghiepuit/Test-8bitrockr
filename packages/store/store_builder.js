import { normalizeEpic, normalizeReducer } from 'utils/stores'
import createHistory from 'history/createBrowserHistory'
import { Map } from 'immutable'
import { functions, isObject } from 'lodash'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { compose as recompose, defaultProps } from 'recompose'
import { applyMiddleware, compose, createStore } from 'redux'
import { combineReducers } from 'redux-immutable'
import { createEpicMiddleware } from 'redux-observable'
import { Subject } from 'rxjs/Subject'
import StoreContainer from './store_container'
import { getNameFunc } from 'utils/functions'
import { autobind } from 'core-decorators'

const log = createLogger('app:packages:store')
const logEpics = createLogger('app:store:epics')

@autobind
class StoreBuilder {
  constructor() {
    this.store = null
    this.browserHistory = null
    this.middleware = []
    this.isDev = false
    this.epic$ = new Subject()
    this.epic$.subscribe((epic) => logEpics('---> Added new epic: ', getNameFunc(epic)))
    this.initialState = Map()
    this.reducerRegistry = Map()
    this.epicMiddleware = null
    this.services = Map()
    this.supportReduxObservable = this.supportReduxObservable.bind(this)
  }

  setInitialState(initialState = Map()) {
    this.initialState = this.initialState.merge(initialState)
    return this
  }

  addMiddleware(middleware) {
    this.middleware.push(applyMiddleware(middleware))
    return this
  }

  supportReduxObservable() {
    log('- Request using redux-observable')
    this.epicMiddleware = createEpicMiddleware((a$, s) => this.epic$.mergeMap((epic) => {
      log('add..')
      return epic(a$, s)
    }))
    this.addMiddleware(this.epicMiddleware)
    return this
  }

  supportRouter() {
    log('- Request using react-router 4')
    this.browserHistory = createHistory()
    this.addMiddleware(routerMiddleware(this.browserHistory))
    this.initialState = this.initialState.set('routing', Map())
    this.reducerRegistry = this.reducerRegistry.set('routing', routerReducer)
    return this
  }

  build() {
    log('- Start building store ********************')
    this.store = createStore(this.getCombineReducers(), this.initialState, this.getEnhanceMiddleware())
    return this.createStoreProvider(this.store)
  }

  createStoreProvider(store) {
    const enhance = recompose(defaultProps({
      store: store,
      injectEpics: this.injectEpics.bind(this),
      injectReducers: this.injectReducers.bind(this),
    }))
    return enhance(StoreContainer)
  }

  injectEpics(epics, namespace = 'main') {
    log('!!!!!injectEpics!!!!!!')
    const epicFuncs = functions(epics)
    log('- Requested inject new epics', functions(epics))
    log('Total epics: ', epicFuncs.length)
    epicFuncs.forEach((epicName) => this.epic$.next(normalizeEpic(epics[`${epicName}`], namespace)))
    return this
  }


  injectReducers(reducers) {
    if (isObject(reducers)) {
      let appendedReducer = Map()
      functions(reducers)
        .forEach((reducerKey) => {
          if (this.reducerRegistry.has(reducerKey)) {
            log('- Inject reducer: Duplicate reducer', reducerKey)
            return this
          } else {
            const reducer = normalizeReducer(reducerKey, reducers[`${reducerKey}`])
            appendedReducer = appendedReducer.set(reducerKey, reducer)
          }
        })
      this.reducerRegistry = this.reducerRegistry.merge(appendedReducer)
      this.updateReducers()
      return this
    }

    log('- Inject reducer: Invalid reducer', reducers)
  }

  getBrowserHistory() {
    return this.browserHistory
  }

  getCombineReducers() {
    return combineReducers(this.reducerRegistry.toJS())
  }

  getEnhanceMiddleware() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    return composeEnhancers(...this.middleware)
  }

  updateReducers() {
    const newReducers = this.getCombineReducers()
    this.store && this.store.replaceReducer && this.store.replaceReducer(newReducers)
  }
}

export default new StoreBuilder()
