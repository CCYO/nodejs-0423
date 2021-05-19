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
    const salt = 'secret'
    try {
        const _password = await hash(password, salt)
        const { results } = await query( queryStr, email, _password)
        console.log('註冊成功!! ==> ', results)
        return results
    } catch(err) {
        return err
    }
}

const searchUser = async (email, password) => {
    const queryStr = `SELECT * FROM users WHERE email = ?`
    let {results, fields} = await query( queryStr, email)
    let user = results[0]
    if(!user) return { msg: '帳號錯誤'}
    if ( !( await compare(password, user.password) ) ){
        return {msg: '密碼錯誤'}
    }
    return user
}



module.exports = {
    query, searchUser, registerUser
}
