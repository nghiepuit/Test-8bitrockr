import React from 'react'
import { StoreBuilder } from 'store'
import { RouterContainer } from 'router'
import createLogger from 'debug'
import registerHttpComponent from '@components/http'
import { flatten } from 'lodash'

/* ================================== *
 * Register modules
 * ================================== */

import address from '@modules/address'

const routes = [
  address,
]

const log = createLogger('app:AppComponent')
const StoreContainer = StoreBuilder
.supportRouter()
.supportReduxObservable()
.build()


/* ================================== *
 * Core service management
 * ================================== */

registerHttpComponent(StoreBuilder)

 /* ================================== *
 * App container define
 * ================================== */

const App = (props) => (
  <StoreContainer>
    <RouterContainer
        history={StoreBuilder.getBrowserHistory()}
        routes={flatten(routes)} />
  </StoreContainer>
)

export default App
