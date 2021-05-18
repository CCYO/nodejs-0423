const { registerUser } = require('../controller/mysql.js')
const passport = require('../controller/passport')

let router = require('express').Router()

//首頁
router.get('/', (req, res) => {
    console.log('111111111111111111112')
    if(req.session.views){
        req.session.views++
    }else{
        req.session.views = 1
    }
    let expireTime = req.session.cookie.maxAge / 1000

    return res.render('index', {
        sessionID: req.sessionID,
        isAuthenticated: req.isAuthenticated(),
        views: req.session.views,
        sessionOriginMaxAge: req.session.cookie.originalMaxAge,
        sessionExpireTime: expireTime,
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
    let result = await registerUser(req.body)
    if(result.affectedRows){
        console.log('註冊成功')
        req.flash('registerSuccess', '註冊成功，請重新登入')
        return res.redirect('/')
    }
    console.log('註冊失敗')
    req.flash('error', result.message)
    return res.redirect('/')
})

module.exports = router