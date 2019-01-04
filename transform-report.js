const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')
const { map } = require('rambda')

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
      report_createdById: created_by,
      report_createdAt: new Date(created_at),
      report_updatedAt: new Date(created_at)
    }
  ]

  const reportFiles = map(fileId => ({
    $e: Uuid(),
    reportFile_reportId: id,
    reportFile_fileId: fileId,
    reportFile_createdAt: new Date(created_at),
    reportFile_updatedAt: new Date(created_at)
  }), file_ids || [])

  const reportRefersTo = map(orgId => ({
    $e: Uuid(),
    reportRefersTo_reportId: id,
    reportRefersTo_orgId: orgId,
    reportRefersTo_createdAt: new Date(created_at),
    reportRefersTo_updatedAt: new Date(created_at)
  }), refers_to || [])

  const reportSharedWith = map(orgId => ({
    $e: Uuid(),
    reportSharedWith_reportId: id,
    reportSharedWith_orgId: orgId,
    reportSharedWith_createdAt: new Date(created_at),
    reportSharedWith_updatedAt: new Date(created_at)
  }), shared_with || [])

  return entities.concat(reportFiles).concat(reportRefersTo).concat(reportSharedWith)
}

module.exports = transformReport
