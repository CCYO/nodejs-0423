let passport = require('passport'),
    localStrategy = require('passport-local')

let { query } = require('./mysql.js')

passport.use( new localStrategy( async (email, password, done) => {
    try {
        let {results, fields} = await query(`SELECT * FROM users WHERE email = ?`, [email])
        let user = results[0]
        if(!user){
            return done(null, false, {msg: '信箱錯誤'})
        }
        if(!(password === user.password)){
            return done(null, false, {msg: '密碼錯誤'})
        }
        return done(null, user)
    } catch(err){
        return done(`ERR in PASSPORT of Strategy then query : ${err}`, false)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.email)
})

passport.deserializeUser( async (email, done) => {
    try{
        let { results, fields } = await query(`SELECT * FROM users WHERE email = ?`, [email])
    } catch(err){
        return done(`ERR in PASSPORT of deserialized then query : ${err}`, false)
    }
})

exports = passport