const { registerUser, searchUser } = require('../controller/mysql.js')
const passport = require('../controller/passport')

let router = require('express').Router()

//首頁
router.get('/', (req, res) => {
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
        verifyFailure: req.flash('error')
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
    res.json(result)
})

module.exports = router