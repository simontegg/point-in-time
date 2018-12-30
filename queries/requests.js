const lfb = require('../lfb')
const pull = require('pull-stream')

const promise = require('./promise')

const tuples = [
  ['?id',           'request_name',         '?name'],
  ['?id',           'request_qSetId',       '?qSetId'],
  ['?id',           'request_requestorId',  '?requestorId'],
  ['?id',           'request_requesteeId',  '?requesteeId'],
  ['?id',           'request_sentBy',       '?sentBy'],
  ['?id',           'request_createdAt',    '?createdAt'],
  ['?id',           'request_submittedAt',  '?submittedAt'],
  ['?id',           'request_updatedAt',    '?updatedAt'],
//
  ['?qSetId',       'qSet_name',            '?questionSetName']
//
  // ['?requestorId',  'person_name',          '?requestorName'],
//
  // ['?requesteeId',  'person_name',          '?requesteeName']
]

const questions = [
  ['?qSetQuestionId', 'qSetQuestion_qSetId',      '?qSetId'],
  ['?qSetQuestionId', 'qSetQuestion_questionId',  '?questionId'],

  ['?questionId',     'question_body',            '?body']
]


function requestById (_, { id }) {
  return promise(pull(
    pull.once(lfb),
    pull.asyncMap((lfb, cb) => lfb.snap(cb)),
    pull.asyncMap((fb, cb) => fb.q(
      tuples, 
      { id: id }, 
      [
        'id',
        'name',
        'qSetId',
        'requestorId',
        'requesteeId',
        'requestorName',
        'requesteeName',
        'createdAt',
        'submittedAt',
        'updatedAt'
      ], 
      cb
    )),
    pull.flatten(),
    pull.asyncMap((request, cb) => {
      lfb.

    })
  ))
}


async function test () {

  try {
    const request = await requestById(null, { id: '51ebe37f-0c0e-4637-a4ec-3af3eccb86c4' })
    console.log(request);

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


