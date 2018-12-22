const Uuid = require('uuid/v4')
process.env.NODE_ENV = 'performance'

const db = require('./db')


async function schema () {
  await db.raw(`
    CREATE TABLE haystack (
      key TEXT,
      value TEXT
    );
  `)
}

const LIMIT = 1000000
const hiddenKey = parseInt(Math.random() * LIMIT)

async function insert () {
  for (let i = 0; i < LIMIT; i ++) {
    const value = i === hiddenKey ? 'needle' : Uuid()

    await db('haystack')
      .insert({
        key: Uuid(),
        value
      })
  }
}

let startTime
let endTime

async function main () {
  // await schema()
  startTime = Date.now()
  query((err, result) => {
    endTime = Date.now()

    console.log({err, result, startTime, endTime});
    console.log((endTime - startTime) / 60000);
    console.log(endTime - startTime);

  })

  // console.log({ startTime, endTime});
  // console.log(endTime - startTime);
}


function query (callback) {
  const stream = db('*').from('haystack').stream()
  let result


  stream.on('data', data => {
    if (data.value !== 'needle') {
      return
    }

    // stream.end()
    callback(null, data)




  })

  // stream.on('end', () => {
    // callback(null, )
//
  // })

  stream.on('error', callback)


}

main()








