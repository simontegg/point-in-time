const pull = require('pull-stream')

module.exports = function promise (source) {
  return new Promise ((resolve, reject) => {
    return pull(source, pull.drain(resolve, err => err ? reject(err) : null))
  })
}
