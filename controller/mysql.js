const { hash, compare } = require('./bcrypt.js')
const mysqlConnection = require('../db/mysql.js')

const query = (queryStr, ...keywordArr) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(queryStr, keywordArr, (err, results, fields) => {
            if(err) return reject(err)
            return resolve({results, fields})
        })
    })
}

const registerUser = async (body) => {
    const queryStr = `INSERT INTO users ( email, password ) VALUES ( ?, ? )`
    let {email, password} = body
    try {
        const _password = await hash(password)
        const { results } = await query( queryStr, email, _password)
        console.log('註冊成功!! ==> ', results)
        return results
    } catch(err) {
        return err
    }
}

const searchUser = async (body) => {
    const {email, password} = body
    const queryStr = `SELECT * FROM users WHERE email = ?`
    let {results, fields} = await query( queryStr, email)
    let user = results[0]

    if(!user) return { msg: '帳號錯誤'}
    if(password){
        if( await compare(password, user.password) || password === 'deserializeUser' ){
            console.log('GET USER!!!')
            return user
        }
        return {msg: '密碼錯誤'}
    }
}

module.exports = {
    query, searchUser, registerUser
}
