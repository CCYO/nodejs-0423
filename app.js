let express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    redisStore = require('connect-redis')(session)

let redisClient = require('./db/redis'),
    router = require('./router/index.js'),
    passport = require('./controller/passport.js')


let app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    console.log('進入 app.js，還沒通過 express-session 中間件，此時 req.session 為/r/n', req.session)
    next()
})

app.use(session({
    secret: 'xxx',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 1,
        httpOnly: true
    },
    store: new redisStore({ client: redisClient})
}))

app.use((req, res, next) => {
    console.log('進入 app.js，通過 express-session 中間件，此時 req.session 為/r/n', req.session)
    next()
})

app.use( passport.initialize() )

app.use((req, res, next) => {
    console.log('進入 app.js，通過 passport-initialize 中間件，此時 req.session 為/r/n', req.session)
    console.log('req.user 為/r/n', req.user)
    next()
})

app.use('/', router)

app.use( passport.session())

app.use((req, res, next) => {
    console.log('進入 app.js，通過 passport-session 中間件，此時 req.session 為/r/n', req.session)
    console.log('req.user 為/r/n', req.user)
    next()
})

app.get('/', (req, res) => {
    let expireTime = req.session.cookie.maxAge / 1000
    return res.render('index', {
        sessionID: req.sessionID,
        isAuthenticated: req.isAuthenticated(),
        views: req.session.views,
        sessionOriginMaxAge: req.session.cookie.originalMaxAge,
        sessionExpireTime: expireTime,
        id: req.user.id,
        email: (req.isAuthenticated() ? req.user.email : null),
    })
})

app.post('/login', passport.authenticate('local', { failureRedirect: '/cantfind'}),  (req, res) => {
    //let user = await searchUser(req.body)
    return res.send({ok: 'OK'})
})

app.listen(process.env.PORT || 8080, () => {
    console.log(`listen.......${process.env.PORT}`)
})
