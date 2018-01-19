const log = createLogger('app:commons:InputValidation')

export function notEmptyInput(input, minLength = 1, maxLength = 255) {
  if (!input) return false
  if (input.match(/^[\s]*$/)) return false
  const len = input.length
  if (len < minLength || len > maxLength) return false
  return true
}
