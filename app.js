let express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    redisStore = require('connect-redis')(session),
    passport = require('passport')

let redisClient = require('./db/redis'),
    mysqlConnection = require('./db/mysql'),
    router = require('./router/index.js')



let app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

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

app.use( passport.initialize() )

app.use('/', router)

app.use( passport.session())

router.post('/login', async (req, res) => {
    //let user = await searchUser(req.body)
    passport.authenticate('local', (err, user, info) => {
        if(err){
            console.log(err)
            res.send('404')
            return
        }
        if(info){
            res.json(info)
            return
        }
        if(!user){
            res.redirect('/login')
            return
        }
        let expireTime = req.session.cookie.maxAge / 1000
        res.render('/', {
            sessionID: req.sessionID,
            isAuthenticated: req.isAuthenticated(),
            views: req.session.views,
            sessionOriginMaxAge: req.session.cookie.originalMaxAge,
            sessionExpireTime: expireTime,
            id: req.user.id,
            email: (req.isAuthenticated() ? req.user.email : null)
        })
        return
    })
})

router.get('/', (req, res) => {
    let expireTime = req.session.cookie.maxAge / 1000
    return res.render('/', {
        sessionID: req.sessionID,
        isAuthenticated: req.isAuthenticated(),
        views: req.session.views,
        sessionOriginMaxAge: req.session.cookie.originalMaxAge,
        sessionExpireTime: expireTime,
        id: req.user.id,
        email: (req.isAuthenticated() ? req.user.email : null)
    })
})


app.listen(process.env.PORT || 8080, () => {
    console.log(`listen.......${process.env.PORT}`)
})
