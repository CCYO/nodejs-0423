const views = (req, res, next) => {
    console.log('+++++++++++++++')
    if(req.session.views){
        req.session.views++
    }else{
        req.session.views = 1
    }
    return next()
}

module.exports = views
