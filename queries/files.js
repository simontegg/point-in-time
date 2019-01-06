const lfb = require('../lfb')
const pull = require('pull-stream')
const paramap = require('pull-paramap')
const { concat, keys, map, reduce } = require('rambda')

const NS_PER_SEC = 1e9;
const time = process.hrtime();

const promise = require('./promise')


  // file_name:                  { type: 'String' },
  // file_url:                   { type: 'String' },
  // file_orgId:                 { type: 'EntityID' },
  // file_createdAt:             { type: 'Date' },
  // file_updatedAt:             { type: 'Date' },
//
  // fileSharedWith_fileId:      { type: 'EntityID' },
  // fileSharedWith_orgId:       { type: 'EntityID' },
  // fileSharedWith_createdAt:   { type: 'Date' },
  // fileSharedWith_updatedAt:   { type: 'Date' },

const tuples = [
  ['?id',                 'file_name',                '?name'],
  ['?id',                 'file_url',                 '?url'],
  ['?id',                 'file_orgId',               '?organizationId'],
  ['?id',                 'file_createdAt',           '?createdAt'],
  ['?id',                 'file_updatedAt',           '?updatedAt']
]

const fileSelect = ['id', 'name', 'url', 'organizationId', 'createdAt', 'updatedAt']

function filesByOrgId (_, { organizationId }) {
  return promise(pull(
    pull.once(lfb),
    pull.asyncMap((lfb, cb) => lfb.snap(cb)),
    pull.asyncMap((fb, cb) => fb.q(tuples, { organizationId }, fileSelect, cb))
  ))
}

async function test () {
  try {

    const files = await filesByOrgId(
      null, 
      { organizationId: 'ba79fbd7-ea9a-493f-b961-03b083fe4a84' }
    )

    console.log(files);

  const diff = process.hrtime(time);
  // [ 1, 552 ]

    console.log(`Benchmark took ${diff[0] + diff[1] / NS_PER_SEC} seconds`);

  } catch (err) {
    console.log({err});
  }
}


test()


