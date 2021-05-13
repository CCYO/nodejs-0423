let express = require('express'),
    bodyParser = require('body-parser'),
    flash = require('connect-flash'),
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
    console.log('進入 app.js，還沒通過 express-session 中間件，此時 req.session 為\n', req.session)
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

app.use(flash())

app.use((req, res, next) => {
    console.log('進入 app.js，通過 express-session 中間件，此時 req.session 為\n', req.session)
    req.flash('aaa', 'AAA')
    req.flash('bbb', {b: 'BBB'})
    req.flash('ccc', {c: function(){console.log('123456')}})
    next()
})

app.use( passport.initialize() )

app.use((req, res, next) => {
    console.log('進入 app.js，通過 passport-initialize 中間件，此時 req.session 為\n', req.session)
    console.log('req.user 為\n', req.user)
    console.log( 'bbb ===> ', req.flash('bbb'))
    let x = req.flash('ccc')
    console.log('x is ===> ', x)
    next()
})

app.use('/', router)

app.use( passport.session())

app.use((req, res, next) => {
    console.log('進入 app.js，通過 passport-session 中間件，此時 req.session 為\n', req.session)
    console.log('req.user 為\n', req.user)
    next()
})

app.get('/index1', (req, res) => {
    console.log('進入 app.js 的 /，此時 req.session 為\n', req.session)
    console.log('req.isAuthenticated is', req.isAuthenticated())
    console.log('req.user 為\n', req.user)
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

app.post('/login', passport.authenticate('local', { failureRedirect: '/verifyFail', failureFlash: true }),  (req, res) => {
    //let user = await searchUser(req.body)
    console.log('通過驗證策略')
    console.log('req.user: ', req.user)
    console.log('req.session: ', req.session)
    if (req.body.k === 'index1') return res.json({ redirect: '/index1'})
    if (req.body.k === 'index2') return res.json({ redirect: '/index2'})
})

app.listen(process.env.PORT || 8080, () => {
    console.log(`listen.......${process.env.PORT}`)
})
