let redis = require('redis')

let redisClient = redis.createClient()

redisClient.on('error', (err) => {
    console.log(`Redis Error: ${err}`)
})

redisClient.on('connect', () => {
    console.log('Redis is connect !!')
})

module.exports = redisClient
