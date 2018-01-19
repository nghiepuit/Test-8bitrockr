import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'
import * as _ from 'lodash'
import * as NotifyConstants from '@commons/constants/Notify'

import {
  changeNotify,
  hideNotify,
} from './list_address.actions'

const initialState = fromJS({
  isShowNotify: false,
  typeOfNotify: NotifyConstants.NOTIFY_TYPE_INFO, // info success warning danger
  titleNotify: '',
  contentNotify: '',
})

export const ListAddressReducers = handleActions({
  [changeNotify]: (state, action) => {
    const { content, title, type } = action.payload
    return state.merge({
      isShowNotify: true,
      typeOfNotify: type,
      titleNotify: title,
      contentNotify: content,
    })
  },

  [hideNotify]: (state, action) => {
    return state.merge({
      isShowNotify: false,
      typeOfNotify: NotifyConstants.NOTIFY_TYPE_INFO, // info success warning danger
      titleNotify: '',
      contentNotify: '',
    })
  },
}, initialState)

