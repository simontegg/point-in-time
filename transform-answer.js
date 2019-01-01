const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')


function transformAnswer ({ 
  id, 
  organization_id,
  question_id,
  model,
  answered_by,
  created_at,
  updated_at
}) {
  const answer = {
    $e: id,
    answer_questionId: question_id,
    answer_orgId: organization_id,
    answer_model: stringify(model),
    answer_createdAt: new Date(created_at),
    answer_updatedAt: new Date(created_at)
  }

  if (answered_by) {
    answer.answer_answeredBy = answered_by
  }

  return answer
}

module.exports = transformAnswer
