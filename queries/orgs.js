const lfb = require('../lfb')
const pull = require('pull-stream')

const promise = require('./promise')

const tuples = [
  ['?orgId', 'org_name', '?name'],
  ['?orgId', 'org_nzbn', '?nzbn']
]

const notNull = nzbn => nzbn !== null

function registeredOrgs () {
  return promise(pull(
    pull.once(lfb),
    pull.asyncMap((lfb, cb) => lfb.snap(cb)),
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
    pull.once(lfb),
    pull.asyncMap((lfb, cb) => lfb.snap(cb)),
    pull.asyncMap((fb, cb) => fb.q(
      publicOrgTuples, 
      { nzbnBusinessType: notNull }, 
      ['orgId', 'name', 'nzbnBusinessType'], 
      cb
    ))
  ))
}

async function test () {

  try {
    const orgs = await allPublicOrgs()
    console.log({ orgs });

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

