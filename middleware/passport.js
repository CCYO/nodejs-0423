let passport = require('passport'),
    localStrategy = require('passport-local').Strategy

let { query, searchUser } = require('../controller/mysql.js')

passport.use( new localStrategy({ usernameField: 'email'}, async (email, password, done) => {
    try {
        console.log('進入 passport.js localStragy 開始驗證')
        let user = await searchUser(email, password)
        if(user.msg){
            return done(null, false, {message: user.msg})
        }
	    return done(null, user)
    } catch(err) {
        console.log('passport.js localStragy 發生內部錯誤')
        return done(err, false)
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
        return done(err, false)
    }
})



module.exports = passport
