const mongoose = require('mongoose');

//Create a schema


const FileSchema = new mongoose.Schema({
    filename:{
        type: String,
        required: true,
    },
    directory:{
        type: String, 
        required: true
    },
    type:{
        type: String, 
        required: true
    },
})

// Use the schema to create a Model!
//What IS user? mongoose.model(<Collectionname>, <CollectionSchema>)
const FileModel = mongoose.model("files", FileSchema)


module.exports = FileModel
