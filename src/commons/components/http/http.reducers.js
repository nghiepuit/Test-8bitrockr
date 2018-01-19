import { handleActions } from 'redux-actions'
import { Map } from 'immutable'
import { fetchData } from './http.actions'

export const httpReducers = handleActions({
  [fetchData]: (state) => state,
} , Map())
