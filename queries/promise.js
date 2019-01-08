const pull = require('pull-stream')
const lfb = require('../lfb')

module.exports = function promise (through) {
  return new Promise ((resolve, reject) => {
    return pull(
      pull.once(lfb),
      pull.asyncMap((lfb, cb) => lfb.snap(cb)),
      through, 
      pull.drain(resolve, err => err ? reject(err) : null)
    )
  })
}
