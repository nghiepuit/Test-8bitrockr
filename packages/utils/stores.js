import { noop } from 'lodash'
import { getNameFunc, setFnName } from 'utils/functions'

export const normalizeEpic = (epic = noop, namespace = 'main') => {
  const name = getNameFunc(epic)
  epic.displayName = (name.indexOf('___') === -1) ? `${namespace}___${name}` : name
  return epic
}

export const normalizeReducer = (key, reducer) => {
  const temp = reducer || noop
  return setFnName(temp, key)
}

const bindActionCreator = (actionCreator, dispatch) => {
  const mainFn = setFnName((...args) => dispatch(actionCreator(...args)), actionCreator.name)
  mainFn.done = (...args) => dispatch(actionCreator.done(...args))
  mainFn.fail = (...args) => dispatch(actionCreator.fail(...args))
  return mainFn
}

export const bindActionCreators = (actionCreators, dispatch) => {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('Invalid actionCreator')
  }

  const keys = Object.keys(actionCreators)
  const boundActionCreators = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}
