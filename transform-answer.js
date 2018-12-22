const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')


function transformAnswer ({ 
  id, 
  organization_id,
  question_id,
  section,
  model,
  answered_by,
  created_at,
  updated_at
}) {
  const answer = {
    $e: id,
    answer_questionId: question_id,
    answer_orgId: organization_id,
    answer_section: section,
    answer_model: stringify(model),
    answer_createdAt: created_at,
    answer_updatedAt: created_at
  }

  if (answered_by) {
    answer.answer_answeredBy = answered_by
  }

  return answer
}

module.exports = transformAnswer
