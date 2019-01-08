const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')

function transformSettings ({ 
  current_org_id,
  agent_id,
  created_at,
  updated_at
}) {
  const setting = {
    $e: Uuid(),
    setting_currentOrgId: current_org_id || '',
    setting_personId: agent_id,
    setting_createdAt: new Date(created_at),
    setting_updatedAt: new Date(updated_at)
  }

  return setting
}

module.exports = transformSettings
