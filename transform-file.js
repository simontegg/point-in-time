const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')
const { map } = require('rambda')



function transformFile ({ 
  id, 
  name,
  organization_id,
  url,
  shared_with,
  created_at,
  updated_at
}) {
  const entities = [
    {
      $e: id,
      file_orgId: organization_id,
      file_name: name,
      file_url: url,
      file_createdAt: new Date(created_at),
      file_updatedAt: new Date(created_at)
    }
  ]

  const fileSharedWith = map(orgId => ({
    $e: Uuid(),
    fileSharedWith_fileId: id,
    fileSharedWith_orgId: orgId,
    fileSharedWith_createdAt: new Date(created_at),
    fileSharedWith_updatedAt: new Date(created_at)
  }), shared_with || [])

  return entities.concat(fileSharedWith)
}

module.exports = transformFile
