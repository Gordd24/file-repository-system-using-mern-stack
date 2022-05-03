const express = require('express');
const bcrypt = require('bcryptjs')
//for routing use router class!
const router = express.Router();

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
const { json } = require('express');

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
        }
        // else if(request.body.password !== request.body.confirmPassword){
        //   response.status(409).json({message: 'passwords dont matches'})
        // }
        else{
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
        let levelValue = 1
        for (let i = 0; i<data.length; i++){
            levelValue = data.length + 1
        }
        if(data.length<4){
          var dir = './files/'+request.body.level;

          if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
    
              try{
                  LevelModel.create({
                  level: [],
                  value:  levelValue
                },(err,doc)=>{
                  if(!err){
                    response.json({level: doc.id})
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



  router.get('/load-levels', async (request, response) => {

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


  //create phase
  // should create the directory.
  router.post('/create-phase', async (request, response) => {

            var dir = './files/'+request.body.level+'/'+request.body.phase;

            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
                try{
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

  router.post('/load-phases', async (request, response) => {

    LevelModel.find({}).then(data => {
      let newArr = []
      for(let i = 0; i < data.length; i++){
        newArr.push(data[i].id)
      }
      let levelId = newArr[request.body.level-1];
      LevelModel.findOne({_id:levelId},function (err, doc){

            let newArr = []
            for(let i = 0; i < doc.level.length; i++){
              newArr.push(i)
            }
            response.json({phases: newArr})    

      })
    
    }) 

   
});


  //create param
  // should create the directory.
  router.post('/create-param', async (request, response) => {
    console.log(request.body.parameter);

    var dir = './files/'+request.body.level+'/'+request.body.phase+'/'+request.body.area+'/'+request.body.parameter;
    console.log(dir)
  
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        try{
          LevelModel.find({}).then(async data => {
            let newArr = []
            for(let i = 0; i < data.length; i++){
              newArr.push(data[i].id)
            }
            let levelId = newArr[request.body.level-1]


            let paramObj = {}
            let areaId = 'level.'+(request.body.phase-1)+'.'+(request.body.area-1);
            paramObj[areaId]='P-'+request.body.parameter

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

 
});


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
      const fs = require("fs");
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
            filesObj[i]={filename:data[i].filename,directory:data[i].directory,type:data[i].type}
          }
          res.json(filesObj)
        }
      );
  
});


router.post("/download-file", (req, res) => {
  res.download('./files/'+req.body.path+'/'+req.body.filename)

});


router.post("/delete-file", (req, res) => {
  const path = './files/'+req.body.path+'/'+req.body.filename

  try {
    fs.unlinkSync(path)
    FileModel.deleteOne({ directory:req.body.path,filename:req.body.filename}).then(function(){
      console.log("Data deleted"); // Success
      res.json({message:'ok'})
    }).catch(function(error){
        console.log(error); // Failure
    });
    //file removed
  } catch(err) {
    console.error(err)
  }

});

module.exports = router;