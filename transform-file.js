const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')

    // id              UUID,
                    // CONSTRAINT file_id_pkey PRIMARY KEY (id),
    // url             TEXT,
                    // CONSTRAINT file_url_unique UNIQUE (url),
    // name            TEXT NOT NULL,
    // organization_id UUID NOT NULL,
                    // CONSTRAINT file_org_id_fkey FOREIGN KEY (organization_id)
                      // REFERENCES kotahi.agent (id) MATCH SIMPLE
                      // ON DELETE CASCADE,
    // created_at      TIMESTAMPTZ,
    // updated_at      TIMESTAMPTZ


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
      file_createdAt: created_at,
      file_updatedAt: created_at
    }
  ]

  const fileSharedWith = map(orgId => ({
    $e: Uuid(),
    fileSharedWith_orgId: orgId,
    fileSharedWith_createdAt: created_at
  }), shared_with)

  return entities.concat(fileSharedWith)
}

module.exports = transformFile
