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
    res.render('/login', {
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

router.post('/login', async (req, res) => {
    //let user = await searchUser(req.body)
    passport.authenticate('local', (err, user, info) => {
        if(err){
            console.log(err)
            res.send('404')
            return
        }
        if(info){
            res.json(info)
            return
        }
        if(!user){
            res.redirect('/login')
            return
        }
        let expireTime = req.session.cookie.maxAge / 1000
        res.render('/', {
            sessionID: req.sessionID,
            isAuthenticated: req.isAuthenticated(),
            views: req.session.views,
            sessionOriginMaxAge: req.session.cookie.originalMaxAge,
            sessionExpireTime: expireTime,
            id: req.user.id,
            email: (req.isAuthenticated() ? req.user.email : null)
        })
        return
    })
})

router.get('/', (req, res) => {
    
})  

module.exports = router
