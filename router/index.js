const router = require('express').Router()

if(process.env.db === 'mongodb'){
    var { registerUser } = require('../controller/user_mongodb')
}else if(process.env.db === 'mysql'){
    var { registerUser } = require('../controller/user_mysql')
}

const passport = require('../middleware/passport'),
    views = require('../middleware/views.js')

router.use(views)

//首頁
router.get('/', (req, res) => {
    // 若已登入，轉到會員首頁
    if(req.session.passport && req.session.passport.user){
        req.flash('registerSuccess', '你已登入，現在為你轉到會員首頁')
        return res.redirect('/user')
    }
    return res.render('index', {
        sessionID: req.sessionID,
        isAuthenticated: req.isAuthenticated(),
        views: req.session.views,
        sessionOriginMaxAge: req.session.cookie.originalMaxAge,
        sessionExpireTime: req.session.cookie.maxAge / 1000,
        // 若登入驗證錯誤，顯示錯誤提醒
        verifyFailure: req.flash('error'),
        registerSuccess: req.flash('registerSuccess')
    })
})

router.post( '/login',
    passport.authenticate('local', {
        // 驗證錯誤，重新導向首頁
        failureRedirect: '/',
        // 將 strategyIns 的 verifyCB 傳入的 info，直接套用 req.flash
        failureFlash: true,
        // 將 strategyIns 的 verifyCB 傳入的 err，直接套用 next(err)
        failWithError: true
    }),
    // verify success
    (req, res) => {
        //let user = await searchUser(req.body)
        return res.redirect('/user')
    }
)

// 送出註冊
router.post('/register', async (req, res, next) => {
    try{
        let {email, password} = req.body
        if(!email){
            req.flash('error', '請填信箱')
        } else if(!password){
            req.flash('error', '請填密碼')
        } else {
            // 註冊，且若註冊成功
            if(await registerUser(email, password)){
                req.flash('registerSuccess', '註冊成功，請重新登入')
            }else{
                req.flash('error', '此信箱已註冊')
            }
        }
        return res.redirect('/')
    } catch(err) {
        next(err)
    }
})

router.use((err, req, res, next) => {
    if(err){
        console.log('router index error ===> ', err )
        next(err)
    }
})

module.exports = router