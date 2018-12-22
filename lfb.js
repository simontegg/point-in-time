const levelup = require('levelup')
const level = require('level')
const levelPackager = require('level-packager')
const sqldown = require('sqldown')

const factory = require('./index')
const schema = require('./schema')

const lev = levelPackager(sqldown)

const db = lev('postgres://postgres:@localhost/lfb', {
  keyEncoding: require('charwise'),
  valueEncoding: 'json'
})

module.exports = factory(db, schema)
