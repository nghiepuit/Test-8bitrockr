import { isArray } from 'lodash'

export const moduleDefaultExport = module => module.default || module

export const esModule = (module, forceArray) => {
  if (isArray(module)) {
    return module.map(moduleDefaultExport)
  }

  const defualted = moduleDefaultExport(module)
  return forceArray ? [defualted] : defualted
}
