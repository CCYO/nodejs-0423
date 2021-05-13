let passport = require('passport'),
    localStrategy = require('passport-local').Strategy

let { query } = require('./mysql.js')

passport.use( new localStrategy({ usernameField: 'email'}, async (email, password, done) => {
    try {
	    console.log('進入 controller/passport.js，開始進行驗證策略')
        let {results, fields} = await query(`SELECT * FROM users WHERE email = ?`, email)
        let user = results[0]
        if(!user){
            return done(null, false, {message: '信箱錯誤'})
        }
        if(!(password === user.password)){
            return done(null, false, {type: 'hi', message: '密碼錯誤'})
        }
        return done(null, user)
    } catch(err){
        return done(`ERR in PASSPORT of Strategy then query : ${err}`, false)
    }
}))

passport.serializeUser((user, done) => {
    console.log('進入 controller/passport.js，開始序列化')
    const {id, email} = user
    done(null, {id, email})
})

passport.deserializeUser( async ({ id, email}, done) => {
    console.log('進入 controller/passport.js，開始反序列化')
    try{
        let { results, fields } = await query(`SELECT * FROM users WHERE email = ?`, email)
        let user = results[0]
        done(null, user)
    } catch(err){
        return done(`ERR in PASSPORT of deserialized then query : ${err}`, false)
    }
})

module.exports = passport
