const lfb = require('../lfb')
const pull = require('pull-stream')
const paramap = require('pull-paramap')
const { concat, keys, map, reduce } = require('rambda')

const NS_PER_SEC = 1e9;
const time = process.hrtime();

const promise = require('./promise')

const address = [
  ['?id', 'address_name',         '?name'],
  ['?id', 'address_orgId',        '?organizationId'],
  ['?id', 'address_line1',        '?line1'],
  ['?id', 'address_line2',        '?line2'],
  ['?id', 'address_suburb',       '?suburb'],
  ['?id', 'address_city',         '?city'],
  ['?id', 'address_availability', '?availability'],
  ['?id', 'address_createdAt',    '?createdAt'],
  ['?id', 'address_updatedAt',    '?updatedAt']
]

const select = [
  'id', 
  'name', 
  'organizationId',
  'line1',
  'line2',
  'suburb',
  'city',
  'availability',
  'createdAt',
  'updatedAt'
]

function addressesByOrgId (_, { organizationId }) {
  return promise(pull(
    pull.asyncMap((fb, cb) => fb.q(address, { organizationId }, select, cb))
  ))
}


const locality = [
  ['?id', 'locality_type',      '?type'],
  ['?id', 'locality_name',      '?name'],
  ['?id', 'locality_code',      '?code'],
  ['?id', 'locality_createdAt', '?createdAt'],
  ['?id', 'locality_updatedAt', '?updatedAt']
]

const localitySelect = ['id', 'type', 'name', 'code', 'createdAt', 'updatedAt']

function allLocalitites () {
  return promise(pull(
    pull.asyncMap((fb, cb) => fb.q(locality, {}, localitySelect, cb))
  ))
}


async function test () {
  try {

    // const addresses = await addressesByOrgId(
      // null,
      // { organizationId: 'ba79fbd7-ea9a-493f-b961-03b083fe4a84' }
    // )

    const localities = await allLocalitites()
    console.log(localities);




  const diff = process.hrtime(time);

    console.log(`Benchmark took ${diff[0] + diff[1] / NS_PER_SEC} seconds`);

  } catch (err) {
    console.log({err});
  }
}


test()


