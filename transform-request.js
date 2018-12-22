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
  received_at,
  submitted_at
}) => {
  const request = {
    $e: id,
    request_name: name,
    request_qSetId: questionSetMap[question_set_name],
    request_requestorId: requestor_id,
    request_requesteeId: requestee_id,
    request_sentBy: sent_by,
    request_createdAt: sent_at,
    request_updatedAt: updated_at,
    request_receivedAt: received_at,
    request_submittedAt: request_submittedAt
  }

  return request
}

module.exports = transformRequest
