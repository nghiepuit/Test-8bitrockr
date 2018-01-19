import React from 'react'
import createDebug from 'debug'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { esModule } from 'utils/modules'
import 'rxjs-addon'
import moment from 'moment'
const log = createDebug('app:index')

import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery'
import 'bootstrap/dist/js/bootstrap.min.js'
window.localStorage.debug = 'app:*'
moment.locale('en')

const domContainer = document.getElementById('root')
let renderApp = () => {
  const App = esModule(require('./modules/main'))
  ReactDOM.unmountComponentAtNode(domContainer)
  ReactDOM.render((<App />), domContainer)
}

if (process.env.NODE_ENV === 'development') {
  renderApp = () => {
    const App = esModule(require('./modules/main'))
    ReactDOM.unmountComponentAtNode(domContainer)
    ReactDOM.render((
      <AppContainer>
        <App />
      </AppContainer>
    ), domContainer)
  }

  if (module.hot) {
    module.hot.accept('./modules/main/index.js', () => renderApp())
  }
}

renderApp()
