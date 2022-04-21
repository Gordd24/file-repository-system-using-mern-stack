const express = require('express'); 
const cors = require('cors')
const mongoose = require('mongoose');
const routes = require('./routes/cict-drive.js')

//reference it as a function
const app = express();
//since 1337 port and 3000 port and front need ng CROSS-ORIGIN RESOURCE SHARING (cors)
app.use(cors());
//since we are passing json we need to tell the express we are expecting json request!
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
//to use routes
app.use('/cictdrive',routes)

//Mongo DB!

// Mongo Db Connect!
mongoose.connect('mongodb://localhost:27017/filerepo');

//Check if MongoDb Connection is Succesful (COPIED!)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

//start a server!
// 1337 is the port of the server!
app.listen(1337, () =>{
    console.log('Server is ready to Listen!');
})