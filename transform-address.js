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
    address_createdAt: created_at,
    address_updatedAt: created_at
  }

  if (body.line1) address.address_line1 = body.line1
  if (body.line2) address.address_line2 = body.line2
  if (body.suburb) address.address_suburb = body.suburb
  if (body.city) address.address_city = body.city
  if (body.availability) address.address_availability = body.availability

  return address
}

module.exports = transformAddress
