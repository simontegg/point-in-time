const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')

function transformQuestion ({ 
  id, 
  identifier,
  version,
  question_set_ids,
  section,
  section_order,
  schema,
  ui,
  created_at
}) {
  const question = {
    $e: id,
    question_identifier: identifier,
    question_version: version,
    question_language: language,
    question_section: section,
    question_order: section_order,
    question_schema: stringify(schema),
    question_ui: stringify(ui),
    question_createdAt: created_at,
    question_updatedAt: created_at
  }

  const qsetQuestions = map(qsetId => ({
    e$: Uuid(),
    qsetQuestion_questionId: id,
    qsetQuestion_qsetId: qsetId,
    create: true
  }), question_set_ids || [])

  qsetQuestions.shift(question)

  return qsetQuestions
}

module.exports = transformQuestion
