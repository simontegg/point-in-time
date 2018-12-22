const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')

function transformAccount ({ 
  agent_id,
  email
}) {
  const account = {
    $e: agent_id,
    person_email: email
  }

  return account
}

module.exports = transformAccount
