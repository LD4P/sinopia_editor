/* eslint security/detect-non-literal-fs-filename: 'off' */
const fs = require('fs')

// Based on https://github.com/webpack-contrib/raw-loader/blob/master/src/index.js
module.exports = {
  process(src, filename) {
    const data = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' })
    const json = JSON.stringify(data)
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')
    return `module.exports = ${json};`
  },
}
