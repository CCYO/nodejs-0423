const { registerUser, searchUser } = require('../controller/mysql.js')

let router = require('express').Router()

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

router.post('/login', async (req, res) => {
    let user = await searchUser(req.body)
    res.json(user)
})

module.exports = router
