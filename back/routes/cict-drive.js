const express = require('express');
const bcrypt = require('bcryptjs')
//for routing use router class!
const router = express.Router();
const jwt = require('jsonwebtoken')
//for files
const fs = require('fs');
//Required package
var pdf = require("pdf-creator-node");

//middleware for uploading files, files will be accesible by req.files.filename
const fileupload = require("express-fileupload");
// const validator = require('../validation/validation')
// const {validate} = require('express-validation')
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

//registration v2 inaayos pa
/* router.post("/sign_up_test",validate(validator.regValidator) ,async(request, response)=>{
  try {
    const userExist = await UserModel.findOne({
      username: request.body.username
    })
    const emailExist = await UserModel.findOne({
      email: request.body.email
    })
      if(userExist){
        response.status(409).json({message: 'This username already exists'})
      }
      if(emailExist){
        response.status(409).json({message: 'This email already exists'})
      }
      const newPassword = await  bcrypt.hash(request.body.password,10)
  } catch (error) {
    console.log(error)
  }
}) */

router.post("/sign_up", async (request, response) =>{
    try{

      const userExist = await UserModel.findOne({
        username: request.body.username
      })
      const emailExist = await UserModel.findOne({
        email: request.body.email
      })
      
        if(userExist && emailExist){
          response.status(409).json({message: 'This username already exists_This email already exists'})
        }
        else if(userExist && !emailExist){
          response.status(409).json({message: 'This username already exists'})
        }else if(!userExist && emailExist){
          response.status(409).json({message: 'This email already exists'})
        }

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
        user: request.body.personName,
        action: "Registered a new user"
        
      })
      await logsModel.save();

      response.status(200).json({message: 'success'})
      
    }catch(err){
      console.log(err) 
    }
  })
  //nagkaron ng error dito habol ko nlng later
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
        user: user.fName + ' ' + user.lName,
        action: 'has updated their name to'+ ' ' + data.fName + ' ' + data.mName+ ' ' + data.lName, 
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
          user: user.fName + ' ' + user.lName,
          action: 'password update'
        })
        logsModel.save()
        const newPassword = await  bcrypt.hash(data.password,10)
        await UserModel.findByIdAndUpdate(data.id,{
          password: newPassword,
        })
        response.status(200).json({ message : 'Update Success'})
      }
  })

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
            user: user.fName + ' ' + user.lName,
            action: 'logged in'
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
      user: request.body.personName,
      action: 'logged out'
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
          let levelValue = 1
          for (let i = 0; i<data.length; i++){
              levelValue = data.length + 1
          }
          if(data.length<4){
            var dir = './files/'+request.body.level;

            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
      
                try{
                  const logsModel = new LogsModel({
                    user: request.body.personName,
                    action: 'created a new level'
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

  router.get('/load-levels',(request, response) => {

    let newArr = []
    LevelModel.find({}).then(data => 
      {
        response.json({data})
      });
  });

  router.post('/logs', async (request, response)=>{
    await LogsModel.find({})
     .then((data)=>{
      //  console.log('Data: ', data)
       response.json(data)
     })
     .catch((error)=>{
       console.log("Error: ", error)
     })
   })

   router.post('/file-uploads', async (request, response)=>{
    await FileModel.find({})
     .then((data)=>{
      //  console.log('Data: ', data)
       response.json(data)
     })
     .catch((error)=>{
       console.log("Error: ", error)
     })
   })


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
            console.log(dir)

            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
                try{
                  const logsModel = new LogsModel({
                    user: request.body.personName,  
                    action: 'created a new phase'
                  })
                  await logsModel.save();
                    let doc = await LevelModel.findOneAndUpdate(
                    { value: request.body.level}, 
                    { $push: {'level':[]}},
                    {new:true});

                    response.json({'phase':doc.level.length})
                    
                    let areaObj = {}
                    let phaseId = 'level.'+(doc.level.length-1);
                    areaObj[phaseId]=[]

                    for(i=0;i<10;i++){

                        var dir = './files/'+request.body.level+'/'+request.body.phase+'/'+(i+1);
                        if (!fs.existsSync(dir)){
                            fs.mkdirSync(dir);
                            await LevelModel.findOneAndUpdate(
                            { value: request.body.level}, 
                            { $push: areaObj},
                            {new:true},);
                        }
                    }
                  
                 
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
            user: request.body.personName,
            action: 'created a new parameter'
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
                        user: blobData.personName, 
                        action: 'uploaded a file named ' + item.name,  
                        filename: item.name,
                        uploadedFile: item.name,
                        areaDir: blobData.areaDir
                      })
                      logsModel.save();
                      FileModel.create({
                        filename:item.name,
                        directory:blobData.dir,
                        areaDir:blobData.areaDir,
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
                      user: blobData.personName, 
                      action: 'uploaded a file named ' + files.name, 
                      uploadedFile: files.name,
                      filename: files.name,
                      areaDir: blobData.areaDir  
                    })
                    logsModel.save();
                    FileModel.create({
                      filename:files.name,
                      directory:blobData.dir,
                      areaDir:blobData.areaDir,
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
    
        FileModel.find({directory:req.body.dir,status:'active'}).then(data => 
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
      user: req.body.personName,
      action:'downloaded a file named '+req.body.filename,
      filename: req.body.filename
    })
    logsModel.save();
    res.download('./files/'+req.body.path+'/'+req.body.filename)
    
  });
  
  


  router.post("/delete-file", (req, res) => {
  
    try {
      FileModel.findOneAndUpdate({ directory:req.body.path,filename:req.body.filename},{status:'unactive'}).then(function(){

        const logsModel = new LogsModel({
          user: req.body.personName,
          action:'removed a file named '+req.body.filename,  
          filename: req.body.filename
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
                user: req.body.personName,
                action:'moved a file from ' + oldPath + ' to ' + newPath,
                filename: data.filename  
              })
              logsModel.save();
                res.json({mess:'Success',newParam:data.newParam})
            }
        });
      }
    })
  });


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
              user: req.body.personName,
              action: 'renamed a file from '+data.oldFilename+data.type+' to '+data.newFilename+data.type,  
              filename: data.newFilename+data.type
            })
            logsModel.save();
              res.json({mess:'Success',newParam:data.newParam})
          }
      });
    }
  })
});

router.post("/load-user-profile", (req, res) => {
  UserModel.findOne({ _id: req.body.id }, function (err, user) {
    res.json(user)
  });
});


router.post("/upload-profile-pic",(req, res) => {
  const img = req.files.img
  img.mv('./profile-pic/'+req.body.id+'.png', (error)=>{
    if(!error){
      res.json({status:1})
    }
  })
});

router.post("/load-profile-pic",(req, res) => {
  fs.readFile('./profile-pic/'+req.body.id+'.png',(err,buffer)=>{
    if(err){
      res.json({file:'none'})
    }else{
      res.json({file:buffer})
    }
  
  })
});

router.post('/generate-action/',(req,res)=>{
  // Read HTML Template
  let html = fs.readFileSync("./templates/log-template.html", "utf8");

  let options = {
    format: "8.5 x 13",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "25mm",
        contents: '<div style="text-align: right;">Prepared By: '+req.body.uploader+'<br/>'+new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString()
    },
    footer: {
        height: "10mm",
        contents: {
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        }
    }

  };
  
  if(req.body.scope === req.body.dateLastWeek){
    var document = {
      html: html,
      data: {
        report: req.body.reportRow,
        scope:req.body.scope + ' - ' + req.body.dateToday,
      },
      path: "./reports/action-logs.pdf",
      type: "",
    };
  }
  else if(req.body.scope === req.body.dateLastMonth){
    var document = {
      html: html,
      data: {
        report: req.body.reportRow,
        scope:req.body.scope + ' - ' + req.body.dateToday
      },
      path: "./reports/action-logs.pdf",
      type: "",
    };
  }else if ((req.body.scope === req.body.dateToday)) {
    var document = {
      html: html,
      data: {
        report: req.body.reportRow,
        scope: req.body.scope
      },
      path: "./reports/action-logs.pdf",
      type: "",
    };
  }else{
     var document = {
      html: html,
      data: {
        report: req.body.reportRow,
        scope: req.body.dateToday
      },
      path: "./reports/action-logs.pdf",
      type: "",
    };
  }
  
  

  pdf
  .create(document, options)
  .then((doc) => {
    res.json({doc})
  })
  .catch((error) => {
    console.error(error);
  });


})

router.get('/download-action-report',(req,res)=>{
  res.download('./reports/action-logs.pdf')
})



router.post('/generate-file/',(req,res)=>{
  // Read HTML Template
  let html = fs.readFileSync("./templates/file-log-template.html", "utf8");

  let options = {
    format: "8.5 x 13",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "25mm",
        contents: '<div style="text-align: right;">Prepared By: '+req.body.uploader+'<br/>'+new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString()
    },
    footer: {
        height: "10mm",
        contents: {
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        }
    }

  };



  if(req.body.scope === req.body.dateLastWeek){
    var document = {
      html: html,
      data: {
        report: req.body.reportRow,
        scope:req.body.scope + ' - ' + req.body.dateToday,
        caption:'Uploaded File Logs'
      },
      path: "./reports/file-logs.pdf",
      type: "",
    
    };
  }  
  else if(req.body.scope === req.body.dateLastMonth){
    var document = {
      html: html,
      data: {
        report: req.body.reportRow,
        scope:req.body.scope + ' - ' + req.body.dateToday,
        caption:'Uploaded File Logs'
      },
      path: "./reports/file-logs.pdf",
      type: "",
    
    };
  }
  else if(req.body.scope === req.body.dateToday){
    var document = {
      html: html,
      data: {
        report: req.body.reportRow,
        scope:req.body.scope,
        caption:'Uploaded File Logs'
      },
      path: "./reports/file-logs.pdf",
      type: "",
    
    };
  }
  else {
    var document = {
      html: html,
      data: {
        report: req.body.reportRow,
        scope:req.body.dateToday,
        caption:'Uploaded File Logs'
      },
      path: "./reports/file-logs.pdf",
      type: "",
    
    };
  }


 

  pdf
  .create(document, options)
  .then((doc) => {
    res.json({doc})
  })
  .catch((error) => {
    console.error(error);
  });


})


router.get('/download-file-report',(req,res)=>{
  res.download('./reports/file-logs.pdf')
})


router.post('/generate-area/',(req,res)=>{
  // Read HTML Template
  let html = fs.readFileSync("./templates/file-log-template.html", "utf8");

  let options = {
    format: "8.5 x 13",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "25mm",
        contents: '<div style="text-align: right;">Prepared By: '+req.body.uploader+'<br/>'+new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString()
    },
    footer: {
        height: "10mm",
        contents: {
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        }
    }

  };

  if(req.body.scope){
    var document = {
      html: html,
      data: {
        report: req.body.reportRow,
        scope:req.body.scope,
        caption:'Area Logs'
      },
      path: "./reports/area-logs.pdf",
      type: "",
    };
  }else{
    var document = {
      html: html,
      data: {
        report: req.body.reportRow,
        scope: '1 - 10',
        caption:'Area Logs'
      },
      path: "./reports/area-logs.pdf",
      type: "",
    };
  }
  

  pdf
  .create(document, options)
  .then((doc) => {
    res.json({doc})
  })
  .catch((error) => {
    console.error(error);
  });


})


router.get('/download-area-report',(req,res)=>{
  res.download('./reports/area-logs.pdf')
})


router.get('/load-archives',async (req,res)=>{
  const archives = await FileModel.find({status:'unactive'})

  if(archives){
    res.json({archives})
  }

})

router.post("/perma-delete-file", (req, res) => {
  console.log('asd')
  const path = './files/'+req.body.path+'/'+req.body.filename

  try {
    fs.unlinkSync(path)
    FileModel.deleteOne({ _id:req.body.id}).then(function(){
      console.log("Data deleted"); // Success
      const logsModel = new LogsModel({
        user: req.body.personName,
        action:'Deleted a file named '+req.body.filename,  
        filename: req.body.filename
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


router.get('/ret-file/:id',async (req,res)=>{
  const archives = await FileModel.findOneAndUpdate({_id:req.params.id},{status:'active'})

  if(archives){
    res.json({message:'ok'})
  }

})



  module.exports = router;