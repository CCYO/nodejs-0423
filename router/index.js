const { registerUser } = require('../controller/mysql.js')
const passport = require('../middleware/passport')
const views = require('../middleware/views.js')

let router = require('express').Router()

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

router.post(
    '/login',
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
router.post('/register', async (req, res) => {
    // 註冊
    let result = await registerUser(req.body)
    // 若註冊成功
    if(result.affectedRows){
        req.flash('registerSuccess', '註冊成功，請重新登入')
        return res.redirect('/')
    }
    console.log('註冊失敗, ERR ===> ', result)
    req.flash('error', result.message)
    return res.redirect('/')
})

module.exports = router