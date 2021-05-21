let mysql = require('mysql')

const config_db = require('../config/db')

const mysqlConnection = mysql.createConnection( config_db.mysql )

mysqlConnection.connect((err) => {
    if(err){
        console.log(`Mysql Err : ${err}`)
        return
    }
    console.log('Mysql Connect OK!')
})

module.exports = mysqlConnection
