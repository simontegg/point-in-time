const Uuid = require('uuid/v4')

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
    locality_createdAt: new Date(created_at),
    locality_updatedAt: new Date(created_at)
  }

  return locality
}

module.exports = transformLocality
