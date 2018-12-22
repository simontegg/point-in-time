const lfb = require('../lfb')
const pull = require('pull-stream')

function promise (stream) {
  return new Promise ((resolve, reject) => {
    return pull(
      stream,
      pull.drain(
        resolve,
        err => {
          if (err) {
            return reject(err)
          }
        }
      )
    )
  })
}

const tuples = [
  ['?relId', 'relationship_subjectId',      '?id'],
  ['?relId', 'relationship_objectId',      '?orgId'],
  ['?id',  'person_name',        '?name']
]

function membersByOrgId (_, { organizationId }) {
  return promise(pull(
    pull.once(lfb),
    pull.asyncMap((lfb, cb) => lfb.snap(cb)),
    pull.asyncMap((fb, cb) => fb.q(tuples, { orgId: organizationId }, ['id', 'name'], cb))
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


















