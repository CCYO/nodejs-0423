let express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    redisStore = require('connect-redis')(session)

let redisClient = require('./db/redis')

var app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({
    secret: 'xxx',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 1,
        httpOnly: true
    },
    store: new redisStore({ client: redisClient})
}))


app.get('/', (req, res) => {
    res.end('OK HELLO, Test')
})

app.listen(process.env.PORT || 8080, () => {
    console.log(`listen.......${process.env.PORT}`)
})
