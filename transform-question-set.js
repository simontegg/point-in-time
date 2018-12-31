const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')
const { map } = require('rambda')

function transformQuestionSet ({ 
  name,
  question_ids
  // created_at,
  // updated_at
}) {
  const now = new Date()

  const qSet = {
    $e: Uuid(),
    qSet_name: name,
    qSet_createdAt: now,
    qSet_updatedAt: now
  }

  const qSetQuestions = map(qId => ({
    $e: Uuid(),
    qSetQuestion_questionId: qId,
    qSetQuestion_qSetId: qSet.$e,
    qSetQuestion_createdAt: now,
    qSetQuestion_updatedAt: now,
  }), question_ids || [])


  return [qSet, qSetQuestions]
}

module.exports = transformQuestionSet
