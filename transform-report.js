const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')

function transformReport ({ 
  id, 
  name,
  organization_id,
  file_ids,
  is_public,
  shared_with,
  refers_to,
  created_by,
  created_at,
  updated_at
}) {
  const entities = [
    {
      $e: id,
      report_name: name,
      report_orgId: organization_id,
      report_isPublic: is_public,
      report_createdBy: created_by,
      report_createdAt: created_at,
      report_updatedAt: created_at
    }
  ]

  const reportFiles = map(fileId => ({
    $e: Uuid(),
    reportFile_fileId: fileId,
    reportFile_createdAt: created_at
  }), file_ids)

  const reportRefersTo = map(orgId => ({
    $e: Uuid(),
    reportRefersTo_orgId: orgId,
    reportRefersTo_createdAt: created_at
  }), shared_with)

  const reportSharedWith = map(orgId => ({
    $e: Uuid(),
    reportRefersTo_orgId: orgId,
    reportRefersTo_createdAt: created_at
  }), shared_with)

  return entities.concat(reportFiles).concat(reportRefersTo).concat(reportSharedWith)
}

module.exports = transformReport
