import React from 'react'
import Props from 'prop-types'
import { Provider } from 'react-redux'
import { withContext } from 'recompose'

const contextTypes = {
  store: Props.object,
  injectEpics: Props.func,
  injectReducers: Props.func,
}

const contextCreator = (props) =>
  ({ store: props.store, injectEpics: props.injectEpics, injectReducers: props.injectReducers })

@withContext(contextTypes, contextCreator)
export default class StoreContainer extends React.Component {

  static propTypes = {
    store: Props.object.isRequired,
    children: Props.element,
    route: Props.element,
  }

  render() {
    const { store, children, route } = this.props
    return (
      <Provider store={store}>
        <div>
          {route || children || null}
        </div>
      </Provider>
    )
  }
}
