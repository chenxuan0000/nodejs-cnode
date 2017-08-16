const Redis = require('ioredis')

let redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
})

module.exports = redis;
// redis.set("chenxuan","now") get chenxuan
// redis.hset("h_set_key","field1","gg1",(e,r) => {
//   console.log(`r1 ${r}`)
// })
// redis.hset("h_set_key","field2","gg2")
//     .then(r => {
//       console.log(`r2 ${r}`)
//     })
//hgetall h_set_key