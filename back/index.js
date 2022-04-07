const express = require('express'); 
const cors = require('cors')
const mongoose = require('mongoose');
//reference it as a function
const app = express();

//since 1337 port and 3000 port and front need ng CROSS-ORIGIN RESOURCE SHARING (cors)
app.use(cors());
//since we are passing json we need to tell the express we are expecting json request!
app.use(express.json()); 


//Mongo DB!

// Mongo Db Connect!
mongoose.connect('mongodb://localhost:27017/filerepo');

//Check if MongoDb Connection is Succesful (COPIED!)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

//Create a schema
const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password:{
        type: String,
        required: true,
    }
  });

// Use the schema to create a Model!
//What IS user? mongoose.model(<Collectionname>, <CollectionSchema>)
const UserModel = mongoose.model("users", UserSchema);



//specify some routes


//Route For Adding User
app.get("/add_user", async (request, response) => {
    const user = new UserModel({
        "name":"admin",
        "username":"admin",
        "password":"admin"
    });
  
    try {
      await user.save();
      response.send(user);
    } catch (error) {
      response.status(500).send(error);
    }
});

//Route For Getting Users
app.get("/users", async (request, response) => {
    const users = await UserModel.find({});
  
    try {
      response.send(users);
    } catch (error) {
      response.status(500).send(error);
    }
  });


//Route For Sign in
app.post("/sign_in", async (request, response) => {

  const user = await UserModel.findOne({
    username: request.body.username,
    password: request.body.password,
  })

  if (user){
        return response.json({status:'user-found'})
  }else{
        return response.json({status:'user-not-found'})
  }
});


//start a server!
// 1337 is the port of the server!
app.listen(1337, () =>{
    console.log('Server is ready to Listen!');
})