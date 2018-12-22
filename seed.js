const Knex = require('knex')
const config = require('./knexfile')[process.env.NODE_ENV || 'development']
const knexfile = require('./knexfile')
const levelup = require('levelup')
const level = require('level')
const levelPackager = require('level-packager')
const sqldown = require('sqldown')
const Uuid = require('uuid/v4')

const factory = require('./index')
const schema = require('./schema')

const lev = levelPackager(sqldown)

const db = lev('postgres://postgres:@localhost/lfb', {
  keyEncoding: require('charwise'),
  valueEncoding: 'json'
})


const t = factory(db, schema)



const { map } = require('rambda')
const stringify = require('fast-json-stable-stringify')

const Agent = require('./transform-agent')
const Relationship = require('./transform-relationship')


const performance = Knex(knexfile.performance)
const staging = Knex(knexfile.staging)

async function seed () {
  // const agents = await staging('kotahi.agent')
    // .select()
//
  // const ents = map(Agent, agents)
  //

  const rels = await staging('kotahi.relationship')
    .select()

  const ents = map(Relationship, rels)

  try {
    await t.tr.transact(ents)

  } catch (err) {
    console.log({err});
  }

  // console.log(ents);




  






}

seed()












