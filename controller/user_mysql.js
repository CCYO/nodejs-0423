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

const searchUser = async (email, password, id) => {
    if(!password && !id){
        return {msg: '密碼沒填'}
    }
    const queryStr = `SELECT * FROM users WHERE email = ?`
    let {results, fields} = await query( queryStr, email)
    if(!user.length) return { msg: '無此信箱'}
    let user = users[0]
    if(password){
        if( await compare(password, user.password) ){
            console.log('GET USER!!!')
            return user
        }
        return {msg: '密碼錯誤'}
    }else if( user.id === id ){
        return user
    }
}

module.exports = {
    query, searchUser, registerUser
}
