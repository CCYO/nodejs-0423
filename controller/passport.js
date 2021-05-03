let passport = require('passport'),
    localStrategy = require('passport-local').Strategy

let { query } = require('./mysql.js')

passport.use( new localStrategy({ usernameField: 'email'}, async (email, password, done) => {
    try {
	console.log(`in controller/passport.js ===> email is ${email}`)
        let {results, fields} = await query(`SELECT * FROM users WHERE email = ?`, email)
        let user = results[0]
        console.log(`in controller/passport.js ==> user in mysql is `, user)
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
        let { results, fields } = await query(`SELECT * FROM users WHERE email = ?`, email)
        let user = results[0]
        done(null, user)
    } catch(err){
        return done(`ERR in PASSPORT of deserialized then query : ${err}`, false)
    }
})

exports = passport
