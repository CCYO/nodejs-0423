const mysqlConnection = require('../db/mysql.js')

const query = (queryStr, ...keywordArr) => {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(queryStr, keywordArr, (err, results, fields) => {
            if(err) throw err
            return resolve({results, fields})
        })
    })
}

const searchUser = async (body) => {
    const queryStr = `SELECT * FROM users WHERE email = ?`
    const {email, password} = body
    try {
            let {results, fields} = await query( queryStr, email)
            let user = results[0]
            if(!user) return { msg: '找不到該帳號'}
            if(!(password === user.password)) return {msg: '密碼錯誤'}
            return user
        }catch(err){
            console.log(`MYSQL ERR: ${err}`)
        }
}



module.exports = {
    searchUser
}
