const lfb = require('../lfb')
const pull = require('pull-stream')

const { map, pipe, reduce } = require('rambda')

const promise = require('./promise')


const org = [
  ['?id',         'org_name',             '?name'],
//
  ['?settingId',  'setting_personId',     '?personId'],
  ['?settingId',  'setting_currentOrgId', '?id']
]

function currentOrg (_, __, { id }) {
  return promise(pull(
    pull.asyncMap((fb, cb) => fb.q(org, { personId: id }, ['id', 'name'], cb)),
    pull.flatten()
  ))
}

const memberOrAdmin = type => 'member_of' || 'admin_of'

const user = [
  ['?id',             'person_name',            '?name'],
  ['?id',             'person_email',            '?email'],

  ['?relationshipId', 'relationship_subjectId', '?id'],
  ['?relationshipId', 'relationship_objectId',  '?orgId'],
  ['?relationshipId', 'relationship_type',      '?type'],
]

const reduceUser = reduce((user, relationship) => {
  if (!user.id) {
    user.id = relationship.id
    user.name = relationship.name
    user.memberOf = []
    user.adminOf = []
  }

  if (relationship.type === 'member_of') {
    user.memberOf.push(relationship.orgId)
  }
  
  if (relationship.type === 'admin_of') {
    user.adminOf.push(relationship.orgId)
  }

  return user
}, {})

function currentUser (_, __, { id }) {
  return promise(pull(
    pull.asyncMap((fb, cb) => fb.q(
      user, 
      { id, type: memberOrAdmin }, 
      ['id', 'name', 'orgId', 'relationshipId', 'type'], 
      cb
    )),
    pull.map(reduceUser)
  ))
}

async function test () {

  try {
    // const curOrg = await currentOrg(null, null, { id: '840e7260-bb7f-4609-8fba-834ff9eb6bf8' })
    // console.log({curOrg});

    const curUser = await currentUser(null, null, { id: '840e7260-bb7f-4609-8fba-834ff9eb6bf8' })
    console.log({curUser});

  } catch (err) {
    console.log({err});
  }
}


test()


// function requestById (_, { id, currentOrgId }, { user }) {
  // const { member_of } = user
  // const memberOfSQLArray = join(',', member_of)
//
  // user is NOT a member_of the requestee org OR request has been submitted
  // OR is a member_of but not currently signed in to requestee org
     // -> respond with submitted answers
   // else user is a member of requestee org AND is signed in with requestee org
   // AND request has not been submitted
     // -> respond with live updated answers
//
//
  // return db.raw(`
    // SELECT rq.*,
           // (SELECT sender.body || jsonb_build_object('id', sender.id)) AS sender,
           // (SELECT requestor.body || jsonb_build_object('id', requestor.id)) AS requestor,
           // (SELECT requestee.body || jsonb_build_object('id', requestee.id)) AS requestee,
           // (CASE
              // WHEN (NOT (
                // rq.requestee_id = ANY(
                  // '{${memberOfSQLArray}}'::UUID[]
                // ))) OR (rq.submitted_at IS NOT NULL) THEN
                // answers_submitted::JSON
              // WHEN (
                // rq.requestee_id = ANY(
                  // '{${memberOfSQLArray}}'::UUID[])
                // ) AND (rq.requestee_id != ?) THEN
                // answers_submitted::JSON
              // ELSE
                // COALESCE(json_agg(a), '[]')
            // END) AS answers
      // FROM kotahi.request AS rq
      // FULL OUTER JOIN kotahi.answer AS a
        // ON a.question_id = ANY(rq.question_ids)
       // AND a.organization_id = rq.requestee_id
      // JOIN kotahi.agent AS sender
        // ON rq.sent_by = sender.id
      // JOIN kotahi.agent AS requestor
        // ON rq.requestor_id = requestor.id
      // JOIN kotahi.agent AS requestee
        // ON rq.requestee_id = requestee.id
     // WHERE rq.id = ?
     // GROUP BY rq.id, sender.id, requestor.id, requestee.id
    // `, [currentOrgId, id])
    // .then(({ rows }) => {
      // const first = rows[0]
//
      // return camelize({
        // ...first,
        // answers: filter(answer => answer !== null, first.answers)
      // })
    // })
// }






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


