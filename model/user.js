const mongoose = require('mongoose')

const USER_SCHEMA = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
})

/* 動、靜態方法，要定義在 Schema 上 */

// 靜態方法，用在指定的 collection（即USER_MODEL）
// USER_SCHEMA.statics.findByEmail = 

// 動態方法，用在指定的 document 上（即 user）
USER_SCHEMA.methods.sayHi = function(){
    // this 是指 user
    console.log(`Hi!!我是 ${this.email}`)
    console.log('我所有的資料 ===> ', this)
}

// 創建 collection, 在 mongodb 此 collection 會被自動命名為 Users
const USER_MODEL = mongoose.model("User", USER_SCHEMA)

module.exports = {
    USER_MODEL
}