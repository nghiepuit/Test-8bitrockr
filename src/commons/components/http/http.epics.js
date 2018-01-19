import { fetchData } from './http.actions'
import { Observable } from 'rxjs/Observable'

export const onFetchData = action$ => {
  return action$
    .ofAction(fetchData)
    .debug('FetchData')
    .switchMap((action) => Observable.empty())
}
