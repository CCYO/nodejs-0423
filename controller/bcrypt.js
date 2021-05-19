const bcrypt = require('bcrypt')
const { salt } = require('../config/envar')

const hash = async (password) => {
    return await bcrypt.hash(password, salt)
}
const compare = (pwd_req, pwd_db) => {
    const pwd = await hash(pwd_req)
    return await bcrypt.compare( pwd, pwd_db )
}
module.exports = {
    hash, compare
}