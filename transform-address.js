const Uuid = require('uuid/v4')
const stringify = require('fast-json-stable-stringify')

function transformAddress ({ 
  id, 
  organization_id,
  body,
  created_at,
  updated_at
}) {
  const address = {
    $e: id,
    address_orgId: organization_id,
    address_name: body.name,
    address_line1: body.line1 || '',
    address_line2: body.line2 || '',
    address_suburb: body.suburb || '',
    address_city: body.city || '',
    address_availability: body.availability || '',
    address_createdAt: new Date(created_at),
    address_updatedAt: new Date(created_at)
  }

  return address
}

module.exports = transformAddress
