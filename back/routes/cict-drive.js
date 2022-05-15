const express = require('express');
const bcrypt = require('bcryptjs')
//for routing use router class!
const router = express.Router();
const jwt = require('jsonwebtoken')
//for files
const fs = require('fs');
//middleware for uploading files, files will be accesible by req.files.filename
const fileupload = require("express-fileupload");

//for files
router.use(fileupload());
router.use(express.static("files"));



//import Schemas
const UserModel = require('../models/user.js');
const LevelModel = require('../models/level.js');
const FileModel = require('../models/file.js');
const LogsModel = require('../models/logs.js')
const { json } = require('express');
//refresh token schema
const RefreshTokenModel = require('../models/refreshToken.js')


const { application, response } = require('express');
const e = require('express');

//specify the routes!
//verify token  
const verify = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (authHeader){
    const token = authHeader.split(" ")[1]
    jwt.verify(token, 'sampleSecretKey',(error,data)=>{
      if(error){
        return response.status(403).json('Token is not valid')
      }

      request.user = data
      next()
    })
  }else{
    response.status(401).json('Not authenticated')
  }
}
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
      //saving logs
      const logsModel = new LogsModel({
        data: request.body.personName + ' ' +'registered a new user',
        
      })
      await logsModel.save();

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
        }
        else{
          response.json({status: err, error:'something wrong'})
        }
      console.log(err) 
    }
  })

  router.post("/update_name", async (request, response) =>{
    const data = request.body
    let errors = []
    const user = await UserModel.findOne({
      _id: data.id,
    })
    
    
     if(data.fName.length === 0|| data.lName.length === 0){
        if(data.fName.length===0)errors.push('First name is required')
        if(data.lName.length===0)errors.push('Last name is required')
        response.status(400).json({errors})
        
     }else{
      const accessToken = jwt.sign({
        id: user._id,
        fName: data.fName,
        mName: data.mName,
        lName: data.lName,
        username: user.username,
        level: user.level,
        phase: user.phase,
        area: user.area,
        type: user.type
      },"sampleSecretKey",{
        expiresIn:"15m"
      })
      const refreshToken = jwt.sign({
        id: user._id,
        fName: data.fName,
        mName: data.mName,
        lName: data.lName,
        username: user.username,
        level: user.level,
        phase: user.phase,
        area: user.area,
        type: user.type
      },"sampleRefreshSecretKey")
      const logsModel = await new LogsModel({
        data: user.fName + ' ' + user.lName + ' ' +'has updated their name to'+ ' ' + 
        data.fName + ' ' + data.mName+ ' ' + data.lName, 
      })
      logsModel.save()

      await UserModel.findByIdAndUpdate(data.id,{
        fName: data.fName,
        mName: data.mName,
        lName: data.lName
      })
      const findTokenInDb = await RefreshTokenModel.findOne({user:user._id})
      if(!findTokenInDb){
        const refreshTokenModel = new RefreshTokenModel({
            token: refreshToken,
            user: user._id
        })
        await refreshTokenModel.save();
      }else{
        //new Token
        await RefreshTokenModel.findOneAndUpdate({user:user._id},{token:refreshToken},{new:true})
      }
      response.status(200).json({
        accessToken,refreshToken
      })
     }
  })
  router.post("/update_password", async (request, response) =>{
      const data = request.body
      const id = data.id
      let errors = []
      const user = await UserModel.findOne({
        _id: data.id,
      })
      if(data.password.length===0||data.confirmPassword.length===0){
        if(data.password.length===0)errors.push('Password is required')
        if(data.confirmPassword.length===0)errors.push('Confirm password is required')
        response.status(400).json({errors})
      }
      else if(data.password !== data.confirmPassword){
        errors.push('Passwords dont match')
        response.status(401).json({errors})
      }else{
        const logsModel = await new LogsModel({
          data: user.fName + ' ' + user.lName + ' ' +'has updated their password',
        })
        logsModel.save()
        const newPassword = await  bcrypt.hash(data.password,10)
        await UserModel.findByIdAndUpdate(data.id,{
          password: newPassword,
        })
        response.status(200).json({ message : 'Update Success'})
      }
      
  })

//sign_in
  /* router.post("/sign_in", async (request, response) => {

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
  }); */

  //take token from  user
  router.post("/refresh", (request, response)=>{
    const refreshToken = request.body.token
      if(!refreshToken) return response.status(401).json('not authenticated')
      const find_refresh_token = RefreshTokenModel.findOne({token:refreshToken})
      if(!find_refresh_token){
        return response.status(403).json('Refresh token not valid')
      }
      jwt.verify(refreshToken,'sampleRefreshSecretKey', (err,user)=>{
        err && console.log(err)
          // refreshTokens = refreshTokens.filter((token)=> token !== refreshToken)
          const newAccessToken = generateAccessToken(user)
          //new token
          RefreshTokenModel.findOneAndUpdate({token:refreshToken},{token:newAccessToken}, {new:true}) 

          response.status(200).json({
            accessToken: newAccessToken
          })

      })
  })


  const generateAccessToken = (user)=>{
    return jwt.sign({
        id: user._id,
        fName: user.fName,
        mName: user.mName,
        lName: user.lName,
        username: user.username,
        level: user.level,
        phase: user.phase,
        area: user.area,
        type: user.type
        
      },"sampleSecretKey",{
        expiresIn:"15m"
      })
  }

  const generateRefreshToken = (user) => {
    return jwt.sign({
        id: user._id,
        fName: user.fName,
        mName: user.mName,
        lName: user.lName,
        username: user.username,
        level: user.level,
        phase: user.phase,
        area: user.area,
        type: user.type
      },"sampleRefreshSecretKey")
  }

  router.post("/sign_in", async (request, response) => {
    const user = await UserModel.findOne({
      username: request.body.username,
    })
  
    if(!user){
      return response.status(400).json('username is incorrectsss')
    }
  
    const isPasswordCorrect = await bcrypt.compare(
      request.body.password,
      user.password
    )
  
    if (isPasswordCorrect){
          const accessToken = generateAccessToken(user)
          const refreshToken = generateRefreshToken(user)
          const findTokenInDb = await RefreshTokenModel.findOne({user:user._id})
          const logsModel = new LogsModel({
            data: user.fName + ' ' + user.lName + ' ' +'has logged in',
          })
          logsModel.save();
          if(!findTokenInDb){
            const refreshTokenModel = new RefreshTokenModel({
                token: refreshToken,
                user: user._id
            })
            await refreshTokenModel.save();
          }else{
            //new Token
            await RefreshTokenModel.findOneAndUpdate({user:user._id},{token:refreshToken},{new:true})
          }
          response.json({
            accessToken,
            refreshToken
          })
    }else{
        return response.status(400).json('password is incorrect')
    }
  });

  
  

  //deauthenticate - logout
  //delete token
  router.delete("/logout",verify,(request, response)=>{
    const refreshToken = request.body.token
    
    const logsModel = new LogsModel({
      data: request.body.personName + ' ' +'has logged out',
    })
    logsModel.save();

    response.json({status: 'ok'})
    RefreshTokenModel.findOneAndDelete({token: refreshToken}, function(error, docs){
      if(error){
        console.log(error)
      }else{console.log("Deleted : ", docs)}
    })
    //refreshTokens= refreshTokens.filter((token)=>token !== refreshToken)
    console.log('logout success')
    response.status(200)
  })

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
                  const logsModel = new LogsModel({
                    data: request.body.personName + ' ' +'created a new level',  
                  })
                  logsModel.save();

                    LevelModel.create({
                      level: [],
                      value:  data.length+1
                      },(err,doc)=>{
                        if(!err){
                          response.json({doc})
                        }
                    })

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
      
  });

  router.get('/load-levels', (request, response) => {

        let newArr = []
        LevelModel.find({}).then(data => 
          {
            response.json({data})
          }
        );
      
    });

  router.get('/levels', async (request, response)=>{
    await LevelModel.find({})
     .then((data)=>{
       console.log('Data: ', data)
       response.json(data)
     })
     .catch((error)=>{
       console.log("Error: ", error)
     })
   })

  //create phase
  // should create the directory.
  router.post('/create-phase', async (request, response) => {

            var dir = './files/'+request.body.level+'/'+request.body.phase;

            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
                try{
                  const logsModel = new LogsModel({
                    data: request.body.personName + ' ' +'created a new phase',  
                  })
                  await logsModel.save();
                  LevelModel.find({}).then(async data => {
                    let newArr = []
                    for(let i = 0; i < data.length; i++){
                      newArr.push(data[i].id)
                    }
                      let levelId = newArr[request.body.level-1]
                      let doc = await LevelModel.findOneAndUpdate(
                        { _id: levelId}, 
                        { $push: {'level':[]}},
                        {new:true});

                      response.json({'phase':doc.level.length-1})

                      
                      let areaObj = {}
                      let phaseId = 'level.'+(doc.level.length-1);
                      areaObj[phaseId]=[]

                      for(i=0;i<10;i++){

                          var dir = './files/'+request.body.level+'/'+request.body.phase+'/'+(i+1);
                          if (!fs.existsSync(dir)){
                              fs.mkdirSync(dir);
                              await LevelModel.findOneAndUpdate(
                              { _id: levelId}, 
                              { $push: areaObj},
                              {new:true},);
                          }
                      }
                  })
                  
                 
                }catch(err){
                  console.log(err)
                  response.json({status: err, error:'something wrong'})
                }
          
          }

  })

  router.post('/load-phases', (request, response) => {

    LevelModel.findOne({value:request.body.level}).then(data => {
            console.log(data)
            let phases = []
            for(let i = 0; i < data.level.length; i++){
              phases.push(i+1)
            }
            response.json({phases})    
    }) 

   
});


  //create param
  // should create the directory.
  router.post('/create-param', async (request, response) => {
    console.log(request.body.paramName);

    var dir = './files/'+request.body.level+'/'+request.body.phase+'/'+request.body.area+'/'+request.body.parameter;
    console.log(dir)
  
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        try{
          const logsModel = new LogsModel({
            data: request.body.personName + ' ' +'created a new parameter',  
          })
          logsModel.save();
          LevelModel.find({}).then(async data => {
            let newArr = []
            for(let i = 0; i < data.length; i++){
              newArr.push(data[i].id)
            }
            let levelId = newArr[request.body.level-1]


            let paramObj = {}
            let areaId = 'level.'+(request.body.phase-1)+'.'+(request.body.area-1);
            paramObj[areaId]=request.body.paramName

            let doc = await LevelModel.findOneAndUpdate(
            { _id: levelId}, 
            { $push: paramObj},
            {new:true});
            let parameter = doc.level[request.body.phase-1][request.body.area-1].length-1
            response.json({'parameter':parameter})

            
          })
          
         
        }catch(err){
          console.log(err)
          response.json({status: err, error:'something wrong'})
        }
  
  }

})


router.post('/load-params', async (request, response) => {

  LevelModel.find({}).then(data => {
    let newArr = []
    for(let i = 0; i < data.length; i++){
      newArr.push(data[i].id)
    }
    let levelId = newArr[request.body.level-1];
    
    LevelModel.findOne({_id:levelId},function (err, doc){
          response.json({parameter: doc.level[request.body.phase-1][request.body.area-1]})    
    })
  
  }) 

  router.post("/upload-file", (req, res) => {
    const newpath = "./tmpfiles/";
    const files = req.files.files;
    const doc = req.files.document;
    const docname = doc.name
    // console.log(filename)
    // console.log(docname)
  
    doc.mv(`${newpath}${docname}`, (err) => {
      if (err) {
        res.status(500).send({ message: "File upload failed", code: 200 });
      }else{
        fs.readFile(newpath+docname, (error, data) => {
            if(error) {
                throw error;
            }
            const blobStr = data.toString();
            blobData = JSON.parse(blobStr)
            dir = './files/'+blobData.dir+'/';
  
            if(typeof(files)=='object'&&files.length>0){
                let filesObj = []
                files.forEach(function (item,id,array) {
                 
                  item.mv(`${dir}${item.name}`, (err) => {
                    if (err) {
                      res.status(500).send({ message: "File upload failed", code: 200 });
                    }else{
                      const logsModel = new LogsModel({
                        data: req.body.personName + ' ' +'has uploaded a file',  
                      })
                      logsModel.save();
                      FileModel.create({
                        filename:item.name,
                        directory:blobData.dir,
                        type:item.mimetype
                      })
                        console.log({filename:item.name,directory:blobData.dir,type:item.mimetype})
                        if (id === array.length - 1){ 
                            filesObj.push({filename:item.name,directory:blobData.dir,type:item.mimetype})
                            res.json(filesObj)
                        }else{
                            filesObj.push({filename:item.name,directory:blobData.dir,type:item.mimetype})
                        }
                    }
                    
                  });
                }); 
              
            }else if(typeof(files)=='object'){
                
                files.mv(`${dir}${files.name}`, (err) => {
                  if (err) {
                    res.status(500).send({ message: "File upload failed", code: 200 });
                  }else{
                    const logsModel = new LogsModel({
                      data: req.body.personName + ' ' +'has uploaded a file',  
                    })
                    logsModel.save();
                    FileModel.create({
                      filename:files.name,
                      directory:blobData.dir,
                      type:files.mimetype
                    })
                  }
  
                  let fileObj=[]
                  fileObj.push({filename:files.name,directory:blobData.dir,type:files.mimetype})
                  res.json(fileObj)
                  
                });
               
            }
  
  
        });
      }
      
    });
  
    
  });
  
  
  router.post("/load-files", (req, res) => {
    
        FileModel.find({directory:req.body.dir}).then(data => 
          {
  
            let filesObj = {}
           
           
  
            for(let i = 0; i < data.length; i++){
              let fileId = data[i].id;
              filesObj[i]={filename:data[i].filename,directory:data[i].directory,type:data[i].type,id:fileId}
            }
            res.json(filesObj)
          }
        );
    
  });
  
  
  router.post("/download-file", (req, res) => {
    const logsModel = new LogsModel({
      data: req.body.personName + ' ' +'has downloaded a file',  
    })
    logsModel.save();
    res.download('./files/'+req.body.path+'/'+req.body.filename)
    
  });
  
  
  router.post("/delete-file", (req, res) => {
    console.log(req.body.id)
    const path = './files/'+req.body.path+'/'+req.body.filename
  
    try {
      fs.unlinkSync(path)
      FileModel.deleteOne({ directory:req.body.path,filename:req.body.filename}).then(function(){
        console.log("Data deleted"); // Success
        const logsModel = new LogsModel({
          data: req.body.personName + ' ' +'has deleted a file',  
        })
        logsModel.save();
        res.json({message:'ok'})
      }).catch(function(error){
          console.log(error); // Failure
      });
      //file removed
    } catch(err) {
      console.error(err)
    }
  
  });


  router.post("/load-dir", (req, res) => {
    LevelModel.find({}, function (err, docs) {
      res.json({directions:[docs[req.body.level-1].level[req.body.phase-1]]})
      
    });
  
  });

  router.post("/move-file", (req, res) => {
    data = req.body
    var oldPath = './files/'+data.level+'/'+data.phase+'/'+data.area+'/'+data.oldParam+'/'+data.filename
    var newPath =  './files/'+data.level+'/'+data.phase+'/'+data.area+'/'+data.newParam+'/'+data.filename
      
      console.log('old',oldPath)
      console.log('new',newPath)
    
    fs.rename(oldPath, newPath, function (err) {
      if (!err){
        
        FileModel.findOneAndUpdate({_id:data.fileId }, 
            {directory:data.level+'/'+data.phase+'/'+data.area+'/'+data.newParam}, null, function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
              const logsModel = new LogsModel({
                data: data.personName + ' ' +'has moved a file',  
              })
              logsModel.save();
                res.json({mess:'Success',newParam:data.newParam})
            }
        });
      }
    })
   
  
  });


  router.post("/rename-file", (req, res) => {
    data = req.body
    var oldPath = './files/'+data.path+'/'+data.oldFilename+'.'+data.type
    var newPath =  './files/'+data.path+'/'+data.newFilename+'.'+data.type
      
      console.log('old',oldPath)
      console.log('new',newPath)
    fs.rename(oldPath, newPath, function (err) {
      if (!err){
        FileModel.findOneAndUpdate({_id:data.fileId }, 
            {filename:data.newFilename+'.'+data.type}, null, function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
              const logsModel = new LogsModel({
                data: data.personName + ' ' +'has renamed a file',  
              })
              logsModel.save();
                res.json({mess:'Success',newParam:data.newParam})
            }
        });
      }
    })
  });
  
 
});




  module.exports = router;