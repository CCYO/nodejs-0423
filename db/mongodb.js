// mongodb 連線
const mongoose = require('mongoose')

const { mongodb } = require('../config/db')

try {
    const db = mongoose.connect(mongodb.url, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('mongoose connect OK!')
} catch (err) {
    console.log('mongoose connect Fail ==> ', err)
}