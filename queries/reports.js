const lfb = require('../lfb')
const pull = require('pull-stream')
const paramap = require('pull-paramap')
const { concat, reduce } = require('rambda')

const NS_PER_SEC = 1e9;
const time = process.hrtime();

const promise = require('./promise')

const tuples = [
  ['?id',                 'report_name',                '?name'],
  ['?id',                 'report_createdAt',           '?createdAt'],
  ['?id',                 'report_updatedAt',           '?updatedAt'],
//
  ['?reportFileId',       'reportFile_reportId',        '?id'],
  ['?reportFileId',       'reportFile_fileId',          '?fileId'],

  ['?fileId',             'file_name',                  '?fileName'],
  ['?fileId',             'file_url',                   '?url'],

  ['?reportSharedWithId', 'reportSharedWith_reportId',  '?id'],
  ['?reportSharedWithId', 'reportSharedWith_orgId',     '?sharedWithId'],

  ['?sharedWithId',       'org_name',                   '?sharedWithName'],

  ['?reportRefersToId',   'reportRefersTo_reportId',    '?id'],
  ['?reportRefersToId',   'reportRefersTo_orgId',       '?refersToId'],

  ['?refersToId',         'org_name',                   '?refersToName']
]

const reportSelect = [
  'id',
  'name',
  'fileId',
  'fileName',
  'url',
  'sharedWithId',
  'sharedWithName',
  'refersToId',
  'refersToName',
  'createdAt',
  'updatedAt'
]

const reduceRelations = reduce((report, join) => {
  report.id = join.id
  report.name = join.name
  report.createdAt = join.createdAt
  report.updatedAt = join.updatedAt
  
  if (!report.fMap) {
    report.fMap = {}
  }

  if (!report.swMap) {
    report.swMap = {}
  }


  if (!report.rtMap) {
    report.rtMap = {}
  }

  report.fMap[join.fileId] = { id: join.fileId, name: join.fileName, url: join.url }
  report.rtMap[join.refersToId] = join.refersToName
  report.swMap[join.sharedWithId] = join.sharedWithName
  
  return report
}, {})

function reportById (_, { id }) {
  return promise(pull(
    pull.once(lfb),
    pull.asyncMap((lfb, cb) => lfb.snap(cb)),
    pull.asyncMap((fb, cb) => fb.q(tuples, { id }, reportSelect, cb)),
    pull.map(reduceRelations)
  ))
}



async function test () {
  try {
    const report = await reportById(
      null, 
      { id: 'c147a23b-3969-4d8b-83c8-bf5fac1b2f0d' }
    )

    console.log(report);

  const diff = process.hrtime(time);
  // [ 1, 552 ]

    console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);

  } catch (err) {
    console.log({err});
  }
}


test()


