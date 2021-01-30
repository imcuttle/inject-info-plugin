/**
 * @file helper
 */

const nps = require('path')

function fixture(...argv) {
  return nps.join.apply(nps, [__dirname, 'fixture'].concat(argv))
}

module.exports = {
  fixture
}
