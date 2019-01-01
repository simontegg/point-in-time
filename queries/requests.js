const lfb = require('../lfb')
const pull = require('pull-stream')
const paramap = require('pull-paramap')

const NS_PER_SEC = 1e9;
const time = process.hrtime();

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
  ['?qSetId',       'qSet_name',            '?questionSetName'],
//
  ['?requestorId',  'org_name',             '?requestorName'],

  ['?requesteeId',  'org_name',             '?requesteeName']
]

const questions = [
  ['?qSetQuestionId', 'qSetQuestion_qSetId',      '?qSetId'],
  ['?qSetQuestionId', 'qSetQuestion_questionId',  '?id'],
//
  ['?id',             'question_identifier',      '?identifier'],
  ['?id',             'question_version',         '?version'],
  ['?id',             'question_language',        '?language'],
  ['?id',             'question_section',         '?section'],
  ['?id',             'question_order',           '?order'],
  ['?id',             'question_schema',          '?schema'],
  ['?id',             'question_ui',              '?ui']
]

const answers = [
  ['?qSetQuestionId', 'qSetQuestion_qSetId',      '?qSetId'],
  ['?qSetQuestionId', 'qSetQuestion_questionId',  '?questionId'],

  ['?id',             'answer_questionId',        '?questionId'],
  ['?id',             'answer_orgId',             '?orgId'],
  ['?id',             'answer_model',             '?model'],
  ['?id',             'answer_createdAt',         '?createdAt'],
  ['?id',             'answer_updatedAt',         '?updatedAt']
]

const requestSelect = [
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
]

function requestById (_, { currentOrgId, id }) {
  return promise(pull(
    pull.once(lfb),
    pull.asyncMap((lfb, cb) => lfb.snap(cb)),
    pull.asyncMap((fb, cb) => fb.q(tuples, { id }, requestSelect, cb)),
    pull.flatten(),
    pull.asyncMap((request, cb) => {
      const { createdAt, qSetId } = request
      const asyncOperations = [
        { op: questionsAtCreated, date: createdAt, qSetId },
        getAnswersOp(request, currentOrgId)
      ]

      console.log(asyncOperations);

      cb(null, asyncOperations)

      // fetchQuestionsAndAnswers(asyncOperations, cb)
    }),
    pull.map(results => {
      
      const [questions, answers] = results

      console.log(questions.length);
      console.log(answers.length);

      return [questions, answers]
    })
  ))
}

function fetchQuestionsAndAnswers (asyncOperations, callback) {
  return pull(
    pull.values(asyncOperations),
    paramap(({ op, date, qSetId }, cb) => op({ date, qSetId }, cb)),
    pull.collect(callback)
  )
}

function questionsAtCreated ({ date, qSetId }, callback) {
  const epoch = new Date(date).getTime()

  lfb.pointInTime(
    epoch, 
    [
      questions,
      { qSetId },
      [ 'id', 'identifier', 'version', 'language', 'section', 'order', 'schema', 'ui']
    ],
    callback
  )
}

function answersAtSubmitted ({ date, qSetId, orgId }, callback) {
  const epoch = new Date(date).getTime()

  lfb.pointInTime(
    epoch, 
    [
      answers,
      { qSetId, orgId },
      [ 'id', 'questionId', 'model', 'createdAt', 'updatedAt']
    ],
    callback
  )
}

function currentAnswers ({ qSetId, orgId }, callback) {
  return pull(
    pull.once(lfb),
    pull.asyncMap((lfb, cb) => lfb.snap(cb)),
    pull.asyncMap((fb, cb) => fb.q(
      answers, 
      { qSetId, orgId }, 
      [ 'id', 'questionId', 'model', 'createdAt', 'updatedAt'],
      cb
    )),
    pull.drain(callback, err => err ? callback(err) : null)
  )
}

function getAnswersOp ({ submittedAt, requestorId, requesteeId, qSetId }, currentOrgId) {
  // query answers at submitted point in time
  if (submittedAt) {
    return { op: answersAtSubmitted, date: submittedAt, qSetId, orgId: requesteeId }
  }

  // requestor cannot access answers until request submitted
  if (currentOrgId === requestorId && !submittedAt) {
    return { op: (_, cb) => cb(null, []) }
  }

  // query live answers
  return { op: currentAnswers, qSetId, orgId: requesteeId }
}


async function test () {

  try {
    const request = await requestById(
      null, 
      { id: '51ebe37f-0c0e-4637-a4ec-3af3eccb86c4', currentOrgId: 'ca29c42a-5a5e-4943-b076-f62ccb63bc31' }
    )

    console.log(request);

  const diff = process.hrtime(time);
  // [ 1, 552 ]

    console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);

    // console.log(diff[0] - diff[1]);
  // benchmark took 1000000552 nanoseconds
    //
    // const stream = lfb.txns.createReadStream()
//
    // stream.on('data', data => {
      // console.log({data});
    // })
//
//
    // stream.on('error', data => {
      // console.log({data});
    // })


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


