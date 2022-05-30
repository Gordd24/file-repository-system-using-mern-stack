const mongoose = require('mongoose')

const LogsSchema = new mongoose.Schema({
        user : String,
        action : String,
        filename : String,
        uploadedFile: String,
        levelDir:String,
        phaseDir:String,
        areaDir : String,
        date : {
            type: Date,
            default:Date.now()
        }
    })
    

    const LogsModel =mongoose.model("Logs",LogsSchema)

module.exports = LogsModel