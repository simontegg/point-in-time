const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')

function transformRole ({ 
  id, 
  name,
  description,
  organization_id,
  financial,
  governance
  created_at,
  updated_at
}) {
  const role = {
    $e: id,
    role_name: name,
    role_description: description,
    role_orgId: organization_id,
    role_financial: financial,
    role_governance: governance,
    role_createdAt: created_at,
    role_updatedAt: updated_at
  }

  return role
}

module.exports = transformRole
