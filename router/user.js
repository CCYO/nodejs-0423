let router = require('express').Router()
const isAuthenticated = require('../controller/isAuthenticated')
const views = require('../middleware/views.js')


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

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router