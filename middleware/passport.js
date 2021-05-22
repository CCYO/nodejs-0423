let passport = require('passport'),
    localStrategy = require('passport-local').Strategy

if(process.env.db === 'mongodb'){
    var { searchUser } = require('../controller/user_mongodb')
}else if(process.env.db === 'mysql'){
    var { searchUser } = require('../controller/user_mysql')
}

passport.use( new localStrategy({ usernameField: 'email'}, async (email, password, done) => {
    try {
        console.log('進入 passport.js localStragy 開始驗證')
        let user = await searchUser(email, password)
        if(user.msg){
            return done(null, false, {message: user.msg})
        }
        console.log('驗證成功')
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

passport.deserializeUser( async ({ email, id}, done) => {
    console.log('進入 controller/passport.js，開始反序列化')
    try{
        let user = await searchUser(email, null, id)
        console.log('user ===>' , user)
        if( user.msg ) return done(null, false, {message: user.msg })
        return done(null, user)
    } catch(err){
        return done(err, false)
    }
})

module.exports = passport
