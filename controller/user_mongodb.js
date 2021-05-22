const { USER_MODEL } = require('../model/user')

const { hash, compare } = require('./bcrypt')

/* 增 */
// 創建 collection 內的一筆資料，稱為 document
const registerUser = async (email, password) => {
    const _password = await hash(password)
    const check = await USER_MODEL.find({email})
    if(check.length) return null
    let user = new USER_MODEL({ email, password: _password })
    return await user.save()
}

/* 刪 */
const deleteUser = async (email, password) => {
    const user = await searchUser(email, password)
    console.log('user ===>', user)
    console.log('user.id ===>', user.id)
    if(user){
        // 若刪除成功，會返回原 user，且不用 save()，mongodb 就會自動刪除了
        // 失敗則 null
        console.log('user.id ===>', user.id)
        result = await USER_MODEL.findOneAndDelete({ _id: user.id })
        console.log('result ===>', result)
        console.log('user.id ===>', user.id)
        if(result.id === user.id){
            return "1"
        }
    }
}


/* 改 */

/* 查 */
const searchUser = async (email, password, id) => {
    if(!password && !id){
        return {msg: '密碼沒填'}
    }
    let users = await USER_MODEL.find({email})
    if(!users.length) return { msg: '無此信箱'}
    let user = users[0]
    if(password){
        console.log('password ===>', password)
        console.log('user.password ===>', user.password)
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
    registerUser, deleteUser, searchUser
}