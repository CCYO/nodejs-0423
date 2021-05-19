const bcrypt = require('bcrypt')
const { salt } = require('../config/envar')

const hash = async (password) => {
    // 對密碼做加鹽加密，且此加鹽是隨機的
    return await bcrypt.hash(password, salt)
}
const compare = async (pwd_req, pwd_db) => {    
    // 比對pwd_req 與 db撈出來的pwd，RV { boolean }
    return await bcrypt.compare( pwd_req, pwd_db )
}
module.exports = {
    hash, compare
}