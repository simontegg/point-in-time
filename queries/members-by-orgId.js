const lfb = require('../lfb')
const pull = require('pull-stream')
const promise = require('./promise')


const tuples = [
  ['?relId', 'relationship_subjectId',      '?id'],
  ['?relId', 'relationship_objectId',      '?orgId'],
  ['?relId', 'relationship_type',      '?type'],
  ['?id',  'person_name',        '?name']
]

function membersByOrgId (_, { organizationId }) {
  return promise(pull(
    pull.asyncMap((fb, cb) => fb.q(
      tuples, 
      { orgId: organizationId, type: 'member_of' }, 
      ['id', 'name'], 
      cb
    ))
  ))
}


async function test () {

  try {
    const members = await membersByOrgId(null, { organizationId: '6ac67a5e-c2c1-4c76-9f0e-91355f279d50' })
    console.log({ members });

  } catch (err) {

    console.log({err});



  }


}


test()


















