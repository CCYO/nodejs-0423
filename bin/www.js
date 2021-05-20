const http = require('http')

const app = require('../app')

const port = process.env.PORT || '8080'

const server = http.createServer(app)

server.listen(port)

server.on('error', (err) => console.log('app listen Err ==> ', err))
server.on('listening', () => console.log(`app listening ${port}`))