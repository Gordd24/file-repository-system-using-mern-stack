const mongoose = require('mongoose');

//Create a schema


const UserSchema = new mongoose.Schema({
    fName:{
        type: String,
        required: true,
    },
    mName:{type: String},
    lName:{
        type: String, 
        required: true
    },
    email:{
        type: String, 
        required: true,
        unique: "true" 
    },
    username:{
        type: String, 
        required: true, 
        unique: true
    },
    password:{
        type: String, 
        required: true,
        minlength:6
    //confirm_password:{type: String, required: true},
    },
    level:{
        type: String, 
         },
    phase:{
        type: String, 
         },
    area:{
        type: String, 
        
    },
    type:{
        type: String, 
        required: true,
    }
},{
    timestamps:true
})

// Use the schema to create a Model!
//What IS user? mongoose.model(<Collectionname>, <CollectionSchema>)
const UserModel = mongoose.model("tbl_users", UserSchema)


module.exports = UserModel
