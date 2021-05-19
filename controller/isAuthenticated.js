// 驗證是否登入
const isAuthenticated = (req, res, next) => {
    // 驗證成功，導向下一個 middleware
    if(req.isAuthenticated()) return next()
    // 驗證失敗，導向登入頁
    req.flash('error', '尚未登入，請登入後再試一次')
    return res.redirect('/')
}

module.exports = isAuthenticated