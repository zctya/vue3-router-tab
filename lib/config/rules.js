import { prunePath } from '../util'

// Built-in rules
export default {
  // The address, if the params are inconsistent, will be cached independently
  path: route => route.path,

  // The full address (ignore hash), if the params or query are inconsistent, it will be cached independently
  fullpath: route => prunePath(route.fullPath)
}
