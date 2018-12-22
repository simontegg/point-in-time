const level = require('level')
const levelup = require('levelup')
const leveldown = require('leveldown')
const levelPackager = require('level-packager')
const sqldown = require('sqldown')
const sub = require('subleveldown')
const Transactor = require('level-fact-base')

const pull = require('pull-stream')
const toPull = require('stream-to-pull-stream')
const flatmap = require('pull-flatmap')

const {
  keys,
  find,
  filter,
  pipe,
  split,
  head,
  toString
} = require('rambda')

const Uuid = require('uuid/v4')

const getName = pipe(
  keys,
  find(key => key !== '$e' && key !== '$retract' && key !== 'create'),
  split('_'),
  head
)

const pad = pipe(toString, str => str.padStart(16 - str.length, '0'))

function factory (db, schema) {
  const tr = Transactor(db, schema)
  const txns = sub(db, 'txns')

  return {
    txns,
    tr,

    snap: tr.snap,

    transact: function (entities, callback) {
      const now = new Date().getTime()
      let schemaByAttr

      return pull(
        pull.once(tr),
        pull.asyncMap((tr, cb) => tr.snap(cb)),
        pull.asyncMap((snap, cb) => {
          schemaByAttr = snap.schema.byAttr
          const nextId = snap.txn + 1
          const nextDecimal = pad(nextId)

          // transaction keys unique combination of epoch and padded transaction no.
          txns.put(`${now}.${nextDecimal}`, nextId, cb)
        }),
        flatmap(() => entities),
        pull.map(entity => {
          const name = getName(entity)

          if (entity.create) {
            entity[`${name}_createdAt`] = now
            delete entity.create
          }

          const updatedAt = `${name}_updatedAt`

          if (schemaByAttr[updatedAt]) {
            entity[updatedAt] = now
          }

          return entity
        }),
        pull.collect((err, ents) => {
          if (err) {
            callback(err)
          }

          tr.transact(ents, callback)
        })
      )
    },

    pointInTime: function (epoch, query, callback) {

      // fetch most recent db version before queryed epoch
      const lte = `${epoch}.9999999999999999`

      return pull(
        toPull.source(txns.createReadStream({ lte, reverse: true, limit: 1 })),
        pull.map(txn => Number(txn.value)),
        pull.asyncMap(tr.asOf),
        pull.asyncMap((fb, cb) => fb.q(query[0], query[1], query[2], cb)),
        pull.drain(
          results => callback(null, results),
          err => err ? callback(err) : null
        )
      )
    }
  }
}

module.exports = factory
