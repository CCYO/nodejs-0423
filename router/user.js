let router = require('express').Router()
const isAuthenticated = require('../controller/isAuthenticated')
const views = require('../middleware/views.js')

if(process.env.db === 'mongodb'){
    var { deleteUser } = require('../controller/user_mongodb')
}else if(process.env.db === 'mysql'){
    var { deleteUser } = require('../controller/user_mysql')
}

router.use( isAuthenticated )

router.use(views)
// 登入首頁
router.get('/', (req, res) => {
    let expireTime = req.session.cookie.maxAge / 1000
    return res.render('user/index', {
        sessionID: req.sessionID,
        isAuthenticated: req.isAuthenticated(),
        views: req.session.views,
        sessionOriginMaxAge: req.session.cookie.originalMaxAge,
        sessionExpireTime:  req.session.cookie.maxAge / 1000,
        id: req.user.id,
        email: (req.isAuthenticated() ? req.user.email : null),
        verifyFailure: req.flash('error'),
        registerSuccess: req.flash('registerSuccess')
    })
})

router.post('/delete', async (req, res, next) => {
    try{
        const {email, password} = req.body
        const result = await deleteUser(email, password)
        if(result === '1'){
            req.logout()
            req.flash('registerSuccess', '帳號已刪除')
            return res.redirect('/')
        }
    } catch (err) {
        return next(err)
    }
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router