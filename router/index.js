let router = require('express').router()

router.get('/', (req, res) => {
    if(req.session.views){
        console.log('views ++')
        req.session.views++
    }else{
        console.log('views init...')
        req.session.views = 1
    }
    let expireTime = req.session.cookie.maxAge / 1000
    console.log(`${req.session.id} coming...`)
    res.render('index', {
        views: req.session.views,
        sessionExpireTime: expireTime,
        sessionOriginMaxAge: req.session.cookie.originalMaxAge
    })
})

router.post('/login', (req, res) => {
    
})

module.exports = router