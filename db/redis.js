let redis = require('redis')

const config_db =  require('./config/db')

let redisClient = redis.createClient(config_db.redis)

redisClient.on('error', (err) => {
    console.log(`Redis Error: ${err}`)
})

redisClient.on('connect', () => {
    console.log('Redis is connect !!')
})

module.exports = redisClient
