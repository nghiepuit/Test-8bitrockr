import { isEqual } from 'lodash'

export const getNameFunc = (func) => func.displayName || func.name || func._name || ''
export const isDifferentFunc = (funcA, funcB) => !isEqual(getNameFunc(funcA), getNameFunc(funcB))
export const setFnName = (fn, name) => Object.defineProperty(fn, 'name', { value: name })
