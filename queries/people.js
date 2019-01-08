const lfb = require('../lfb')
const pull = require('pull-stream')
const paramap = require('pull-paramap')
const { concat, filter, keys, map, pipe, reduce } = require('rambda')

const NS_PER_SEC = 1e9;
const time = process.hrtime();

const promise = require('./promise')


const orgMembers = [
  ['?id', 'person_name',                '?name'],
  ['?id', 'person_email',               '?email'],

  ['?relId', 'relationship_subjectId',  '?id'],
  ['?relId', 'relationship_objectId',   '?organizationId'],
  ['?relId', 'relationship_type',       '?type']
]

const select = ['id', 'name', 'email', 'type' ]
const memberOrAdmin = type => 'member_of' || 'admin_of'

function reduceMembers (joins) {
  const adminMap = reduce((acc, join) => {
    if (join.type === 'admin_of') {
      acc[join.id] = true  
    }

    return acc
  }, {}, joins)

  const addIsAdmin = pipe(
    filter(join => join.type === 'member_of'),
    map(join => {
      join.isAdmin = Boolean(adminMap[join.id])
      delete join.type
      return join
    })
  )
  
  return addIsAdmin(joins)
}

function membersByOrgId (_, { organizationId }) {
  return promise(pull(
    pull.asyncMap((fb, cb) => fb.q(
      orgMembers, 
      { organizationId, type: memberOrAdmin }, 
      select, 
      cb
    )),
    pull.map(reduceMembers)
  ))
}

function staffByOrgId (_, { organizationId }) {
  return promise(pull(
    pull.asyncMap((fb, cb) => fb.q(
      orgMembers, 
      { organizationId, type: 'staff_member_of' }, 
      select, 
      cb
    ))
  ))
}

async function test () {
  try {

    // const members = await membersByOrgId(
      // null,
      // { organizationId: 'ca29c42a-5a5e-4943-b076-f62ccb63bc31' }
    // )
//
    // console.log(members);

    const staff = await staffByOrgId(
      null, 
      { organizationId: '66b3aadb-e5bc-4cf8-a10a-d99b2634650b' }
    )

    console.log(staff);


  const diff = process.hrtime(time);
  // [ 1, 552 ]

    console.log(`Benchmark took ${diff[0] + diff[1] / NS_PER_SEC} seconds`);

  } catch (err) {
    console.log({err});
  }
}


test()


