let router = require('express').Router()

// 登入首頁
router.get('/', (req, res) => {
    console.log('12345689')
    let expireTime = req.session.cookie.maxAge / 1000
    return res.render('user/index', {
        sessionID: req.sessionID,
        isAuthenticated: req.isAuthenticated(),
        views: req.session.views,
        sessionOriginMaxAge: req.session.cookie.originalMaxAge,
        sessionExpireTime: expireTime,
        id: req.user.id,
        email: (req.isAuthenticated() ? req.user.email : null),
    })
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router