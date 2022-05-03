const mongoose = require('mongoose')

const RefreshTokenSchema = new mongoose.Schema({
    token: String,
    user:{
        type:mongoose.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema)