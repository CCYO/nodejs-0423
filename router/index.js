const { registerUser, searchUser } = require('../controller/mysql.js')

const passport = require('../controller/passport.js')

let router = require('express').Router()

router.get('/login', (req, res) => {
    if(req.session.views){
        console.log('views ++')
        req.session.views++
    }else{
        console.log('views init...')
        req.session.views = 1
    }
    let expireTime = req.session.cookie.maxAge / 1000
    console.log(`${req.session.id} coming...`)
    return res.render('/login', {
        sessionID: req.sessionID,
        views: req.session.views,
        sessionExpireTime: expireTime,
        sessionOriginMaxAge: req.session.cookie.originalMaxAge
    })
})

router.get('/register', (req, res) => {
    if(req.session.views){
        console.log('views ++')
        req.session.views++
    }else{
        console.log('views init...')
        req.session.views = 1
    }
    let expireTime = req.session.cookie.maxAge / 1000
    console.log(`${req.session.id} coming...`)
    res.render('register', {
        views: req.session.views,
        sessionExpireTime: expireTime,
        sessionOriginMaxAge: req.session.cookie.originalMaxAge
    })
})


router.post('/register', async (req, res) => {
    let result = await registerUser(req.body)
    res.json(result)
})

  

module.exports = router
