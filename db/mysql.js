let mysql = require('mysql')

const mysqlConnection = mysql.createClient({
    host: '10.140.0.3',
    user: 'root',
    password: '',
    database: 'redis_session_demo'
})

mysqlConnection.connect((err) => {
    if(err){
        console.log(`Mysql Err : ${err}`)
        return
    }
    console.log('Mysql Connect OK!')
})

module.exports = mysqlConnection