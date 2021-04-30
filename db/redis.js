let redis = require('redis')

let redisClient = redis.createClient()

redisClient.on('error', (err) => {
    console.log(`Redis Error: ${err}`)
})

module.exports = redisClient
