var express = require('express')
var path = require('path')
//var handlerServer = require('')

var app = express()


app.get('/', (req, res) => {
    res.end('OK HELLO, Test')
})

app.listen(process.env.PORT || 8080, () => {
    console.log('listen.......')
})