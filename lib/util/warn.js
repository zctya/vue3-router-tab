const prefix = '[Vue Router Tab]'

// Error
export function assert(condition, message) {
  if (!condition) {
    throw new Error(`${prefix} ${message}`)
  }
}

// Warn
export function warn(condition, message) {
  if (!condition) {
    typeof console !== 'undefined' && console.warn(`${prefix} ${message}`)
  }
}

// Common messages
export const messages = {
  renamed(newName, target = 'method') {
    return `The ${target} has been renamed to "${newName}", please modify it before using`
  }
}
