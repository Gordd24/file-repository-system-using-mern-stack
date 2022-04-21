const express = require('express');
const bcrypt = require('bcryptjs')
//for routing use router class!
const router = express.Router();


//import Schemas
const UserModel = require('../models/user.js')


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


  module.exports = router;