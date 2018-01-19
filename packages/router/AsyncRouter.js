import React from 'react'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import PropTypes from 'prop-types'
import { esModule } from 'utils/modules'
import createLog from 'debug'
import { getNameFunc } from 'utils/functions'
import LoadingComponent from './components/Loading'
import ErrorComponent from './components/Error'
const log = createLog('app:router:asyncRoute')

export default function asyncRoute(getComponent, getReducers, getEpics, beforeMount = Promise.resolve()) {
  return class AsyncRoute extends React.Component {
    static contextTypes = {
      store: PropTypes.object.isRequired,
      injectEpics: PropTypes.func.isRequired,
      injectReducers: PropTypes.func.isRequired,
    }

    static Component = null
    static ReducersLoaded = false
    static EpicsLoaded = false

    state = {
      Component: AsyncRoute.Component,
      ReducersLoaded: AsyncRoute.ReducersLoaded,
      EpicsLoaded: AsyncRoute.EpicsLoaded,
      error: null,
    }

    componentWillMount() {
      log('componentWillMount')
      const { Component, ReducersLoaded, EpicsLoaded } = this.state
      const { injectEpics, injectReducers } = this.context
      const shouldLoadReducers = !ReducersLoaded && getReducers
      const shouldLoadEpics = !EpicsLoaded && getEpics

      if (!Component || shouldLoadReducers || shouldLoadEpics) {

        (!Component) && log('- Loading async component by function:', getNameFunc(getComponent))
        shouldLoadReducers && log('Loading reducers...')
        shouldLoadEpics && log('Loading epics...')

        this._componentWillUnmountSubject = new Subject()
        const streams = [
          Component
            ? Observable.of(Component)
                .takeUntil(this._componentWillUnmountSubject)
            : Observable.fromPromise(getComponent())
                .map(esModule)
                .map(AsyncComponent => {
                  AsyncRoute.Component = AsyncComponent
                  return AsyncComponent
                })
                .takeUntil(this._componentWillUnmountSubject),
        ]

        if (shouldLoadReducers) {
          log('shouldLoadReducers')
          streams.push(
            Observable.fromPromise(getReducers())
              .map(module => esModule(module, true))
              .map(reducers => {
                log('injectReducers')
                console.log('injectReducers:', reducers[0])
                injectReducers(reducers[0])
                AsyncRoute.ReducersLoaded = true
              })
              .takeUntil(this._componentWillUnmountSubject)
          )
        }

        if (shouldLoadEpics) {
          streams.push(
            Observable.fromPromise(getEpics())
              .map(epics => {
                injectEpics(epics)
                AsyncRoute.EpicsLoaded = true
              })
              .takeUntil(this._componentWillUnmountSubject)
          )
        }

        Observable.zip(...streams)
          .takeUntil(this._componentWillUnmountSubject)
          .subscribe(([AsyncComponent]) => {
            log('- Load successful component: ', getNameFunc(AsyncComponent))
            if (this._mounted) {
              this.setState({ Component: AsyncComponent })
            } else {
              this.setState({ Component: AsyncComponent })
            }
            this._componentWillUnmountSubject.unsubscribe()
          }, (error) => {
            this.setState({ error })
          })
      }
    }

    componentDidMount() {
      this._mounted = true
    }

    componentWillUnmount() {
      if (this._componentWillUnmountSubject && !this._componentWillUnmountSubject.closed) {
        this._componentWillUnmountSubject.next()
        this._componentWillUnmountSubject.unsubscribe()
      }
    }

    render() {
      const { Component, error } = this.state
      if (error) return <ErrorComponent error={error} />
      log(error)
      error && error.stack && log(error.stack)
      return Component ? <Component {...this.props} /> : <LoadingComponent />
    }
  }
}
