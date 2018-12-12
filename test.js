const levelup = require('levelup')
const level = require('level')
const levelPackager = require('level-packager')
const sqldown = require('sqldown')
const Uuid = require('uuid/v4')

const factory = require('./index')
const schema = require('./schema')

const lev = levelPackager(sqldown)

const db = lev(':memory:', {
  keyEncoding: require('charwise'),
  valueEncoding: 'json'
})


const tr = factory(db, schema)

const orgId = Uuid()
const org2Id = Uuid()
const qsetId = Uuid()
const questionId = Uuid()
const qsetQuestionId = Uuid()
const answerId = Uuid()
const answer2Id = Uuid()
const requestId = Uuid()

// in english:
// fetch the requestee's answers associated with the 
// request's questionSet's questions
const answersByRequest = [
  ['?rqId', 'request_qsetId',           '?qsetId'],
  ['?rqId', 'request_requesteeId',      '?requesteeId'],

  ['?qqId', 'qsetQuestion_qsetId',      '?qsetId'],
  ['?qqId', 'qsetQuestion_questionId',  '?qId'],

  ['?aId',  'answer_questionId',        '?qId'],
  ['?aId',  'answer_orgId',             '?requesteeId'],
  ['?aId',  'answer_model',             '?model'],
  ['?aId',  'answer_createdAt',         '?createdAt'],
  ['?aId',  'answer_updatedAt',         '?updatedAt']
]

// entitities with complex relationships
// requests have_one requestor_org
// requests have_one requestee_org
// requests have_one questionSet
// questionSets have_many questions
// questions have_many questionSets
// answers have_one question
// answers have_one org
tr.transact(
  [
    { 
      $e: orgId, 
      org_name: 'test', 
      create: true 
    },
    { 
      $e: org2Id, 
      org_name: 'org2', 
      create: true 
    },
    { 
      $e: qsetId, 
      qset_name: 'main question set', 
      create: true 
    },
    { 
      $e: questionId, 
      question_body: 'best question',
      create: true 
    },
    { 
      $e: Uuid(), 
      question_body: 'nother question',
      create: true 
    },
    { 
      $e: answerId, 
      answer_orgId: orgId,
      answer_questionId: questionId,
      answer_model: 'an answer',
      create: true 
    },
    { 
      $e: answer2Id, 
      answer_orgId: org2Id,
      answer_questionId: questionId,
      answer_model: 'second answer',
      create: true 
    },
    { 
      $e: qsetQuestionId, 
      qsetQuestion_qsetId: qsetId,
      qsetQuestion_questionId: questionId,
      create: true 
    },
    { 
      $e: requestId, 
      request_requesteeId: orgId,
      request_requestorId: org2Id,
      request_qsetId: qsetId,
      create: true 
    },
  ],
  async (err, fb) => {

    const results = await fb.q(
      answersByRequest,
      { rqId: requestId },
      ['model', 'aId', 'updatedAt', 'createdAt']
    )

    // initial results from first transaction
    console.log({ results1: results })

    setTimeout(async function () {
      await tr.transact([
        { 
          $e: answerId, 
          answer_model: 'updated answer',
        }
      ], async (err, fbNext) => {
        const results = await fbNext.q(
          answersByRequest,
          { rqId: requestId },
          ['model', 'aId', 'updatedAt', 'createdAt']
        )

        const answer = results[0]

        // midpoint between first a second transactions
        const midTime = parseInt(((answer.updatedAt - answer.createdAt) / 2) + answer.createdAt)

        // results after second transaction
        console.log({ results2: results });

        tr.pointInTime(
          midTime, 
          [
            answersByRequest,
            { rqId: requestId },
            ['model', 'aId', 'updatedAt', 'createdAt']
          ],
          (err, results) => {

            // results from the transaction prior to queried epoch
            console.log({ results3: results});

          }
        
        )


      })
    }, 3000)
  }
)






