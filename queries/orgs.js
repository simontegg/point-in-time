const pull = require('pull-stream')
const { contains } = require('rambda')

const promise = require('./promise')
const lfb = require('../lfb')

const tuples = [
  ['?orgId', 'org_name', '?name'],
  ['?orgId', 'org_nzbn', '?nzbn']
]

const notNull = nzbn => nzbn !== null

function registeredOrgs () {
  return promise(pull(
    pull.asyncMap((fb, cb) => fb.q(
      tuples, 
      { nzbn: notNull }, 
      ['orgId', 'name', 'nzbn'], 
      cb
    ))
  ))
}

const publicOrgTuples = [
  ['?orgId', 'org_name', '?name'],
  ['?orgId', 'org_nzbnBusinessType', '?nzbnBusinessType']
]

function allPublicOrgs () {
  return promise(pull(
    pull.asyncMap((fb, cb) => fb.q(
      publicOrgTuples, 
      { nzbnBusinessType: notNull }, 
      ['orgId', 'name', 'nzbnBusinessType'], 
      cb
    ))
  ))
}

const memberOrgs = [
  ['?id', 'org_name', '?name'],
  ['?id', 'org_nzbnBusinessType', '?nzbnBusinessType'],

  ['?relId', 'relationship_subjectId', '?memberId'],
  ['?relId', 'relationship_objectId', '?id'],
  ['?relId', 'relationship_type', '?type']
]

function orgsByMemberId (_, { memberId }) {
  return promise(pull(
    pull.asyncMap((fb, cb) => fb.q(
      memberOrgs, 
      { memberId, type: 'member_of' },
      ['id', 'name', 'nzbnBusinessType'], 
      cb
    ))
  ))
}

const ngoTuples = [
  ['?id', 'org_name', '?name'],
  ['?id', 'org_nzbnBusinessType', '?nzbnBusinessType']
]

function isNGO (nzbnBusinessType) {
  return contains(
    nzbnBusinessType, 
    ['Charitable Trust', 'NZ Limited Company', 'Incorporated Society']
  )
}

function allNGOs () {
  return promise(pull(
    pull.asyncMap((fb, cb) => fb.q(
      ngoTuples, 
      { nzbnBusinessType: isNGO },
      ['id', 'name', 'nzbnBusinessType'], 
      cb
    ))
  ))
}

async function test () {

  try {
    // const orgs = await orgsByMemberId(null, { memberId: '29ded863-823c-45eb-ab50-618bc76e6818' })
    // console.log({ orgs });


    const ngos = await allNGOs()
    console.log(ngos)

  } catch (err) {
    console.log({err});
  }
}


test()






// function allPublicOrgs () {
  // return db.raw(`
    // SELECT (a.body || jsonb_build_object('id', a.id)) AS org
      // FROM kotahi.agent AS a
     // WHERE a.agent_type = 'Organization'
       // AND a.nzbn_business_type != 'N/A'
     // ORDER BY body->>'name' ASC;
    // `)
    // .then(({ rows })=> map(row => row.org, rows))
// }
//
// function allRegisteredOrgs() {
  // return db.raw(`
    // SELECT (a.body || jsonb_build_object('id', a.id)) AS org
      // FROM kotahi.agent AS a
     // WHERE a.agent_type = 'Organization'
       // AND a.body->>'nzbn' IS NOT NULL
     // ORDER BY body->>'name' ASC;
    // `)
    // .then(({ rows }) => map(row => row.org, rows))
// }

