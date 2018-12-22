const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')

function transformQuestionSet ({ 
  name
  created_at,
  updated_at
}) {
  const qSet = {
    $e: Uuid(),
    qSet_name: name,
    qSet_createdAt: created_at,
    qSet_updatedAt: created_at
  }

  return answer
}

module.exports = transformQuestionSet
