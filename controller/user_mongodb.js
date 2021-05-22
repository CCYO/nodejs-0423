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
    const _password = await hash(password)
    const user = USER_MODEL.findOneAndDelete({ email, password: _password })
    await user.save()
    const user_arr =  await USER_MODEL.find({email})
    return user_arr[0]
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
    registerUser, searchUser
}