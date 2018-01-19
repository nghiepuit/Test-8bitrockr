import * as epics from './http.epics'
import * as reducers from './http.reducers'

const log = createLogger('app:services:http:register')
export const key = Object.keys(reducers)[0] || 'none'

const register = ({ injectReducers, injectEpics, store }) => {
  injectReducers(reducers)
  injectEpics(epics)
}

export default register
