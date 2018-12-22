const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')

    // id                  UUID         DEFAULT uuid_generate_v4(),
                        // PRIMARY KEY (id), -- relationship_pk
    // relationship_type   TEXT  DEFAULT '',
    // role_id             UUID,
    // subject_id          UUID          NOT NULL,
                        // CONSTRAINT subject_id_fkey FOREIGN KEY (subject_id)
                             // REFERENCES kotahi.agent (id) MATCH SIMPLE
                             // ON DELETE CASCADE ON UPDATE CASCADE,
    // object_id           UUID          NOT NULL,
                        // CONSTRAINT object_id_fkey FOREIGN KEY (object_id)
                            // REFERENCES kotahi.agent (id) MATCH SIMPLE
                            // ON DELETE CASCADE ON UPDATE CASCADE,
    // start_date          TIMESTAMPTZ,
    // end_date            TIMESTAMPTZ,
    // body                JSONB DEFAULT '{}',
    // created_at          TIMESTAMPTZ,
    // updated_at          TIMESTAMPTZ


// CREATE TABLE kotahi.role (
  // id                    UUID NOT NULL DEFAULT uuid_generate_v4(),
                        // PRIMARY KEY (id),
  // name                  TEXT NOT NULL,
  // description           TEXT,
  // organization_id       UUID,
                        // CONSTRAINT organization_id_fkey FOREIGN KEY (organization_id)
                             // REFERENCES kotahi.agent (id) MATCH SIMPLE
                             // ON DELETE CASCADE ON UPDATE CASCADE,
  // financial             BOOLEAN DEFAULT FALSE,
  // governance            BOOLEAN DEFAULT FALSE,
  // created_at            TIMESTAMPTZ,
  // updated_at            TIMESTAMPTZ


function transformRelationship ({ 
  id, 
  subject_id,
  object_id,
  relationship_type,
  role_id,
  start_date,
  end_date,
  created_at,
  updated_at,
  body
}) {
  const rel = {
    $e: id,
    relationship_type,
    relationship_subjectId: subject_id,
    relationship_objectId: object_id,
    relationship_createdAt: new Date(created_at),
    relationship_updatedAt: new Date(updated_at)
  }

  if (body.is_volunteer !== undefined) rel.relationship_volunteer = (body.is_volunteer === 'Yes')
  if (body.works_with_children !== undefined) rel.relationship_withChildren = (body.works_with_children === 'Yes')
  if (role_id) rel.relationship_roleId = role_id
  if (start_date) rel.relationship_startDate = new Date(start_date)
  if (end_date) rel.relationship_endDate = new Date(end_date)

  // if (body.roles) {
    // for (let i = 0; i < body.roles; i++) {
      // rel.push({})
    // }
//
//
  // }

  return rel
}

module.exports = transformRelationship
