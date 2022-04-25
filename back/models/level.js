const mongoose = require('mongoose');

//Create a schema
const LevelSchema = new mongoose.Schema({
    
    level:{type : Array , "default" : []},
    value: {type: Number},
})


// Use the schema to create a Model!
//mongoose.model(<Collectionname>, <CollectionSchema>)
const LevelModel = mongoose.model("levels", LevelSchema)


module.exports = LevelModel