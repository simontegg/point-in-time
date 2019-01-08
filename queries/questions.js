const lfb = require('../lfb')
const pull = require('pull-stream')

const { map, pipe, uniqWith } = require('rambda')

const promise = require('./promise')


const questions = [
  ['?qSetId',         'qSet_name',                '?name'],
//
  ['?qSetQuestionId', 'qSetQuestion_qSetId',      '?qSetId'],
  ['?qSetQuestionId', 'qSetQuestion_questionId',  '?questionId'],
//
  ['?questionId',     'question_identifier',      '?identifier']
]

function questionsByQuestionSetId (_, { name }) {
  return promise(pull(
    pull.asyncMap((fb, cb) => fb.q(
      questions, 
      { name }, 
      ['questionId', 'identifier'],
      cb
    ))
  ))
}

const questionsAsked = [
  ['?requestId',      'request_requesteeId',      '?requesteeId'],
  ['?requestId',      'request_qSetId',           '?qSetId'],

  ['?qSetQuestionId', 'qSetQuestion_qSetId',      '?qSetId'],
  ['?qSetQuestionId', 'qSetQuestion_questionId',  '?id'],
//
  ['?id',             'question_identifier',      '?identifier'],
  ['?id',             'question_schema',          '?schema'],
  ['?id',             'question_ui',              '?ui']
]

function parse (question) {
  question.schema = JSON.parse(question.schema)
  question.ui = JSON.parse(question.ui)
  return question
}

const parseQuestions = pipe(uniqWith((x, y) => x.id === y.id), map(parse))

function questionsAskedByOrgId (_, { organizationId }) {
  return promise(pull(
    pull.asyncMap((fb, cb) => fb.q(
      questionsAsked, 
      { requesteeId: organizationId }, 
      ['id', 'identifier', 'schema', 'ui'],
      cb
    )),
    pull.map(parseQuestions)
  ))
}

const answers = [
  ['?id', 'answer_questionId', '?questionId'],
  ['?id', 'answer_orgId',      '?organizationId'],
  ['?id', 'answer_model',      '?model'],
  ['?id', 'answer_createdAt',  '?createdAt'],
  ['?id', 'answer_updatedAt',  '?updatedAt']
]

function parseAnswers (answers) {
  return map(answer => {
    answer.model = JSON.parse(answer.model)
    return answer
  }, answers)
}

function answersByOrgId (_, { organizationId }) {
  return promise(pull(
    pull.asyncMap((fb, cb) => fb.q(
      answers, 
      { organizationId }, 
      ['id', 'questionId', 'model'],
      cb
    )),
    pull.map(parseAnswers)
  ))
}

async function test () {

  try {
    // const questions = await questionsByQuestionSetId(null, { name: 'Central TAS Desk Audit Question Set' })
    // console.log(questions);

    // const questionsA = await questionsAskedByOrgId(null, { organizationId: '18b85fb9-92ec-4c67-a82b-1c553d034c40' })
    // console.log({questionsA});

    const answers = await answersByOrgId(null, { organizationId: '07f108d0-0ede-4e7f-8919-97da88c18e4e' })
    console.log({answers}, answers.length);



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


