// Import the language configuration in the directory
// eslint-disable-next-line no-undef
const context = require.context('./', false, /^((?!index).)*\.js$/)

// Language configuration
export default context.keys().reduce((map, path) => {
  let [, key] = /\.\/(.*).js/g.exec(path)
  map[key] = context(path).default
  return map
}, {})
