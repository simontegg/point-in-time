const levelup = require('levelup')
const level = require('level')
const levelPackager = require('level-packager')
const sqldown = require('sqldown')
const leveldown = require('leveldown')

const factory = require('./index')
const schema = require('./schema')

// const lev = levelPackager(sqldown)
const lev = levelPackager(leveldown)

// const db = lev('postgres://postgres:@localhost/lfb', {
  // keyEncoding: require('charwise'),
  // valueEncoding: 'json'
// })
//
const db = lev('./level', {
  keyEncoding: require('charwise'),
  valueEncoding: 'json'
})


module.exports = factory(db, schema)
