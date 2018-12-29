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



const { map, pluck, zipObj } = require('rambda')
const stringify = require('fast-json-stable-stringify')

const Agent = require('./transform-agent')
const Relationship = require('./transform-relationship')
const Request = require('./transform-request')
const QSet = require('./transform-question-set')


const performance = Knex(knexfile.performance)
const staging = Knex(knexfile.staging)

async function seed () {
  // const agents = await staging('kotahi.agent')
    // .select()
//
  // const ents = map(Agent, agents)
//
//
  // const rels = await staging('kotahi.relationship')
    // .select()
//
  // const ents = map(Relationship, rels)
  //
  //
  try {

    const qSet = await staging('kotahi.question_set')
      .select()

    const qSets = map(QSet, qSet)
    const questionSetMap = zipObj(map(qs => qs.qSet_name, qSets), map(qs => qs.$e, qSets))

    const r = await staging('kotahi.request').select()

    console.log({qSets, questionSetMap});

    const request = map(Request(questionSetMap), r)

    console.log({request});

    const ents = qSets.concat(request)




    await t.tr.transact(ents)

  } catch (err) {
    console.log({err});
  }

  // console.log(ents);




  






}

seed()












