const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')

function transformSettings ({ 
  current_org_id,
  agent_id,
  created_at,
  updated_at
}) {
  const settings = {
    $e: Uuid(),
    settings_currentOrgId: current_org_id,
    settings_agentId: agent_id,
    settings_createdAt: created_at,
    settings_updatedAt: updated_at
  }

  return settings
}

module.exports = transformSettings
