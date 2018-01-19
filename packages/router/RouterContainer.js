import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import { renderRoutes } from 'react-router-config'
import { isEmpty } from 'lodash'
import createLogger from 'debug'
import NotFound from './components/NotFound'

const log = createLogger('app:RouterContainer')

export default class RouterContainer extends React.Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.array.isRequired,
  }

  render() {
    const { history, routes } = this.props

    log('- Render route container with routes:', routes)
    return (
      <ConnectedRouter history={history}>
        <Switch>
          {
            isEmpty(routes)
            ? <Route path='/' component={NotFound} />
            : renderRoutes(routes)
          }
          <Route component={NotFound} />
        </Switch>
      </ConnectedRouter>
    )
  }
}

RouterContainer.propTypes = {

}
