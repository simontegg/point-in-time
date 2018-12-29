const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')

function transformQuestionSet ({ 
  name
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

  return qSet
}

module.exports = transformQuestionSet
