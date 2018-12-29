const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')

const transformRequest = questionSetMap => ({ 
  id, 
  name,
  question_set_name,
  requestor_id,
  requestee_id,
  sent_by,
  sent_at,
  updated_at,
  submitted_at
}) => {
  const request = {
    $e: id,
    request_name: name,
    request_qSetId: questionSetMap[question_set_name],
    request_requestorId: requestor_id,
    request_requesteeId: requestee_id,
    request_sentBy: sent_by,
    request_createdAt: new Date(sent_at),
    request_updatedAt: new Date(updated_at)
  }

  if (submitted_at) request.request_submittedAt = submitted_at

  return request
}

module.exports = transformRequest
