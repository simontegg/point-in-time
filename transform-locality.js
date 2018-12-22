const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')

function transformLocality ({ 
  id, 
  name,
  area_type,
  code,
  created_at,
  updated_at
}) {
  const locality = {
    $e: id,
    locality_type: area_type,
    locality_name: name,
    locality_code: code,
    locality_createdAt: created_at,
    locality_updatedAt: created_at
  }
}

module.exports = transformLocality
