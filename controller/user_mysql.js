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

const registerUser = async (email, password) => {
    const check = await searchUser(email, password)
    if(check.id) return null
    const queryStr = `INSERT INTO users ( email, password ) VALUES ( ?, ? )`
    const { results } = await query( queryStr, email, _password)
    if(results.affectedRows){
        const queryStr = `SELECT * FROM users WHERE email = ?`
        let {results, fields} = await query( queryStr, email)
        return results[0]
    }
}

const searchUser = async (email, password, id) => {
    if(!password && !id){
        return {msg: '密碼沒填'}
    }
    const queryStr = `SELECT * FROM users WHERE email = ?`
    let {results, fields} = await query( queryStr, email)
    if(!results.length) return { msg: '無此信箱'}
    let user = results[0]
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
