const Knex = require('knex')
const config = require('./knexfile')[process.env.NODE_ENV || 'development']
const knex = Knex(config)

module.exports = knex
