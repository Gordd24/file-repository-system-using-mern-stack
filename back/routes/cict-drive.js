const express = require('express');
const bcrypt = require('bcryptjs')
//for routing use router class!
const router = express.Router();

//for files
const fs = require('fs');

//import Schemas
const UserModel = require('../models/user.js');
const LevelModel = require('../models/level.js');
const { application } = require('express');

//specify the routes!

//registration
router.post("/sign_up", async (request, response) =>{
  
  const userExist = await UserModel.findOne({
    username: request.body.username
  })
  const emailExist = await UserModel.findOne({
    email: request.body.email
  })
  
    try{
      const newPassword = await  bcrypt.hash(request.body.password,10)
      await UserModel.create({
        fName: request.body.fName,
        mName: request.body.mName,
        lName: request.body.lName,
        email: request.body.email,
        username: request.body.username,
        password: newPassword,
        //confirm_password: request.body.confirm_password,
        level: request.body.level,
        phase: request.body.phase,
        area: request.body.area,
        type: request.body.type,
      })
      response.json({status: 'ok'})
      
    }catch(err){
      if(userExist|| emailExist){
          let userMsg =""
          let emailMsg =""
          if(userExist){
             userMsg ="Username already exists."    
          }
          if(emailExist){
            emailMsg = "Email already exists."
          }
          response.status(409).json({message: userMsg + "_" + emailMsg})
        }else{
          response.json({status: err, error:'something wrong'})
        }
      console.log(err)
      
    }
  
   
  })


//sign_in
  router.post("/sign_in", async (request, response) => {

    const user = await UserModel.findOne({
      username: request.body.username,
    })
  
    if(!user){
      return response.json({status:'user-not-found'})
    }
  
    const isPasswordCorrect = await bcrypt.compare(
      request.body.password,
      user.password
  
    )
  
    if (isPasswordCorrect){
          return response.json({status:'user-found'})
    }else{
          return response.json({status:'user-not-found'})
    }
  });


  //create level
  // should create the directory.
  // Shall be able to filter if the level is at its maximum.
  router.post('/create-level', async (request, response) => {

      LevelModel.find({}).then(data => 
        {
          if(data.length<4){
            var dir = './files/'+request.body.level;

            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
      
                try{
                    LevelModel.create({
                    level: []
                  })
                  response.json({level: request.body.level})
                  
                }catch(err){
                  console.log(err)
                  response.json({status: err, error:'something wrong'})
                }
          
            }

          }else{
              response.json({level:'Maximum'})
          }
        }
      );

     

     

      // await LevelModel.findOneAndUpdate(
      //   { _id: '626072d5d97cb44ff44620d3'}, 
      //   { $push: {'level':[]}}
      // );
      
  });

  router.get('/load-levels', async (request, response) => {

      // LevelModel.count({}, function( err, count){
      //   console.log( "Number of users:", count );
      // })

      let newArr = []
      LevelModel.find({}).then(data => 
        {
          for(let i = 0; i < data.length; i++){
            newArr.push(data[i].id)
          }
          response.json({level: newArr})
        }
      );
      

      
    
  });


  // router.get('/load');


  module.exports = router;