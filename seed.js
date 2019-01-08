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

const t = require('./lfb')
// const f = require('./index')


const { filter, flatten, map, pluck, zipObj } = require('rambda')
const stringify = require('fast-json-stable-stringify')

const Address = require('./transform-address')
const Account = require('./transform-account')
const Agent = require('./transform-agent')
const Answer = require('./transform-answer')
const File = require('./transform-file')
const Locality = require('./transform-locality')
const Relationship = require('./transform-relationship')
const Report = require('./transform-report')
const Request = require('./transform-request')
const QSet = require('./transform-question-set')
const Question = require('./transform-question')
const Setting = require('./transform-settings')

const performance = Knex(knexfile.performance)
const staging = Knex(knexfile.staging)

async function seed () {
  try {
    const a = await staging('kotahi.agent').select()
    const agents = map(Agent, a)

    const acc = await staging('kotahi_private.account').select()
    const accounts = map(Account, acc)

    const ans = await staging('kotahi.answer').select()
    const answers = map(Answer, ans)

    const l = await staging('kotahi.area').select()
    const localities = map(Locality, l)

    const addr = await staging('kotahi.address').select()
    const addresses = map(Address, addr)
  //
    const rels = await staging('kotahi.relationship').select()
    const rel = map(Relationship, rels)

    const q = await staging('kotahi.question').select()
    const questions = map(Question, q)

    const qSet = await staging('kotahi.question_set').select()
    const qs = map(QSet, qSet)
    const qSets = map(q => q[0], qs)
    const qSetQuestions = flatten(map(q => q[1], qs))

    const questionSetMap = zipObj(map(qs => qs.qSet_name, qSets), map(qs => qs.$e, qSets))

    const r = await staging('kotahi.request').select()
    const request = map(Request(questionSetMap), r)

    const f = await staging('kotahi.file').select()
    const files = flatten(map(File, f))

    const rep = await staging('kotahi.report').select()
    const reports = flatten(map(Report, rep))

    const sets = await staging('kotahi.settings').select()
    const settings = map(Setting, sets)

    const ents = agents
      .concat(accounts)
      .concat(answers)
      .concat(localities)
      .concat(addresses)
      .concat(rel)
      .concat(questions)
      .concat(qSets)
      .concat(qSetQuestions)
      .concat(request)
      .concat(files)
      .concat(reports)
      .concat(settings)

    // console.log(settings);

    await t.seed(ents)
    //

  } catch (err) {
    console.log({err});
  }





  






}

seed()












