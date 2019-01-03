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
//
//
// const t = factory(db, schema)


const t = require('./lfb')
// const f = require('./index')


const { filter, flatten, map, pluck, zipObj } = require('rambda')
const stringify = require('fast-json-stable-stringify')

const Agent = require('./transform-agent')
const Answer = require('./transform-answer')
const Relationship = require('./transform-relationship')
const Request = require('./transform-request')
const QSet = require('./transform-question-set')
const Question = require('./transform-question')


const performance = Knex(knexfile.performance)
const staging = Knex(knexfile.staging)

async function seed () {
  try {
    const a = await staging('kotahi.agent')
      .select()
  //
    const agents = map(Agent, a)

    const ans = await staging('kotahi.answer').select()
    const answers = map(Answer, ans)
  //
  //
    const rels = await staging('kotahi.relationship')
      .select()

    const rel = map(Relationship, rels)

    const q = await staging('kotahi.question')
      .select()

    const questions = map(Question, q)

    const qSet = await staging('kotahi.question_set')
      .select()

    const qs = map(QSet, qSet)
    const qSets = map(q => q[0], qs)
    const qSetQuestions = flatten(map(q => q[1], qs))

    const questionSetMap = zipObj(map(qs => qs.qSet_name, qSets), map(qs => qs.$e, qSets))

    const r = await staging('kotahi.request').select()

    const request = map(Request(questionSetMap), r)

    const ents = agents
      .concat(answers)
      .concat(rel)
      .concat(questions)
      .concat(qSets)
      .concat(qSetQuestions)
      .concat(request)

    console.log(request);
    await t.seed(ents)
    //

  } catch (err) {
    console.log({err});
  }





  






}

seed()












