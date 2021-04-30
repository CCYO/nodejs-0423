let mysql = require('mysql')

const mysqlConnection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
})

mysqlConnection.connect((err) => {
    if(err){
        console.log(`Mysql Err : ${err}`)
        return
    }
    console.log('Mysql Connect OK!')
})

module.exports = mysqlConnection
