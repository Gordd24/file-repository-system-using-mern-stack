const mongoose = require('mongoose')

const LogsSchema = new mongoose.Schema({
        data : String,
    },
    {
        timestamps: true 
    })


module.exports = mongoose.model("Logs",LogsSchema)