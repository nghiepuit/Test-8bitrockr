import { createAsyncAction } from 'store'

export const changeNotify = createAsyncAction('CHANGE_NOTIFY', (type, title, content) => {
  return {
    type,
    title,
    content,
  }
})

export const hideNotify = createAsyncAction('HIDE_NOTIFY')
