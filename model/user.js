const mongoose = require('mongoose')

const { hash, compare } = require('../controller/bcrypt')

const USER_SCHEMA = new mongoose.Schema({
    email: String,
    password: String
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

// 創建 collection 內的一筆資料，稱為 document
const registerUser = async (body) => {
    let {email, password} = body
    const _password = await hash(password)
    const user = new USER_MODEL({ email, _password })
    await user.save()
    const user_arr =  await USER_MODEL.find({email})
    return user_arr[0]
}

const searchUser = async (email, password) => {
    const user_arr = await USER_MODEL.find({email})
    if(!user_arr.length) return { msg: '無此信箱'}
    if( !(await compare(password, user_arr[0].password)) ){
        return {msg: '密碼錯誤'}
    }
    return user_arr[0]
}

module.exports = {
    USER_MODEL, registerUser, searchUser
}