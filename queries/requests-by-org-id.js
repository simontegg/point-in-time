const lfb = require('../lfb')
const pull = require('pull-stream')
const paramap = require('pull-paramap')
const { concat } = require('rambda')

const NS_PER_SEC = 1e9;
const time = process.hrtime();

const promise = require('./promise')

const tuples = [
  ['?id',           'request_name',         '?name'],
  ['?id',           'request_requestorId',  '?requestorId'],
  ['?id',           'request_requesteeId',  '?requesteeId'],
  ['?id',           'request_sentBy',       '?sentBy'],
  ['?id',           'request_createdAt',    '?createdAt'],
  ['?id',           'request_submittedAt',  '?submittedAt'],
  ['?id',           'request_updatedAt',    '?updatedAt'],
//
  ['?requestorId',  'org_name',             '?requestorName'],

  ['?requesteeId',  'org_name',             '?requesteeName']
]


const requestSelect = [
  'id',
  'name',
  'requestorId',
  'requesteeId',
  'requestorName',
  'requesteeName',
  'createdAt',
  'submittedAt',
  'updatedAt'
]

function requestsByOrgId (_, { organizationId }) {
  return new Promise ((resolve, reject) => {
    return pull(
      pull.once(lfb),
      pull.asyncMap((lfb, cb) => lfb.snap(cb)),
      pull.map(fb => {
        return [
          { op: requestsByRequestorId(fb), orgId: organizationId },
          { op: requestsByRequesteeId(fb), orgId: organizationId }
        ]
      }),
      pull.flatten(),
      paramap(({ op, orgId }, cb) => op(orgId, cb)),
      pull.collect((err, [byRequestorId, byRequesteeId]) => {
        if (err) {
          return reject(err)
        }

        resolve(concat(byRequestorId, byRequesteeId))
      })
    )
  })
}

const requestsByRequestorId = fb => (orgId, callback) => fb.q(
  tuples, { requestorId: orgId }, requestSelect, callback
)

const requestsByRequesteeId = fb => (orgId, callback) => fb.q(
  tuples, { requesteeId: orgId }, requestSelect, callback
)


async function test () {

  try {
    const requests = await requestsByOrgId(
      null, 
      { organizationId: 'ca29c42a-5a5e-4943-b076-f62ccb63bc31' }
    )

    console.log(requests);

  const diff = process.hrtime(time);
  // [ 1, 552 ]

    console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);

  } catch (err) {
    console.log({err});
  }
}


test()


