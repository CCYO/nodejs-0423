const express = require('express'),
    flash = require('connect-flash'),
    session = require('express-session'),
    redisStore = require('connect-redis')(session)

const redisClient = require('./db/redis')

const router = require('./router/index.js'),
    user_router = require('./router/user.js')
    // 添加 req.isAuthenticated、req.logout 等 passportJS 賦予在 req 上的東西
    // strategyIns、serializeUser、deserializeUser等自己設定的 passport方法，則需用 initialize 初始化

const    passport = require('./middleware/passport.js')

let app = express()

app.set('view engine', 'ejs')

// express 4.16+ 不推薦使用 body-parse
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

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

// 會用到 session，所以必須放在session之後
app.use(flash())

// 會用到 session，所以必須放在session之後
// 初始化 passport 設定，如 strategyIns、serializeUser、deserializeUser
app.use( passport.initialize() )

app.use((req, res, next) => {
    console.log('app session ===> ', req.session)
    next()
})

// 不需要認證的路由
app.use('/', router)

// 調用 passport.deserializeUser
app.use( passport.session())

//需要登入身分的路由
app.use('/user', user_router)

// 處理 next(err)
app.use((err, req, res, next) => {
    if(err){
        console.log('error ===> ', err )
        return res.render('404', {
            err: err.message
        })
    }
})

app.listen(process.env.PORT || 8080, () => {
    console.log(`listen.......${process.env.PORT}`)
})
