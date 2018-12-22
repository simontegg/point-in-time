const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')

    // id                  UUID         DEFAULT uuid_generate_v4(),
                        // PRIMARY KEY(id),
    // agent_type          TEXT NOT NULL,
    // nzbn_business_type  TEXT NOT NULL DEFAULT 'N/A',
    // legal_entity_type   LTREE,
    // body                JSONB DEFAULT '{}', -- TODO enforce NOT NULL
    // created_at          TIMESTAMPTZ,
    // updated_at          TIMESTAMPTZ


function transformAgent ({ 
  id,
  agent_type,
  nzbn_business_type,
  body,
  legal_entity_type,
  created_at,
  updated_at
}) {
  if (agent_type === 'Person') {
    const person = {
      $e: id,
      person_createdAt: created_at,
      person_updatedAt: updated_at
    }

    if (body.name) person.person_name = body.name

    return person
  }

  const now = new Date()

  const org = {
    $e: id,
    org_name: body.name,
    org_nzbnBusinessType: nzbn_business_type,
    org_createdAt: new Date(created_at) || now,
    org_updatedAt: new Date(updated_at) || now
  }

  console.log(org.org_createdAt);

  if (!created_at) {

    console.log((org));
    
  }



  if (legal_entity_type) org.org_legalEntityType = legal_entity_type
  if (body.nzbn) {
    org.org_nzbn = parseInt(body.nzbn)
  }
  if (body.hex_color) org.org_color = body.hex_color
  if (body.hex_color) org.org_color = body.hex_color

  return org
}

module.exports = transformAgent
