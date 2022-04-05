const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model')
const jwt  = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/filerepo')

app.post('/api/login', async(req, res)=>{

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password,
    })

    if (user){
        const token = jwt.sign(
            {
                name: user.name,
                username: user.username
            },
            'secret123'
        )
        return res.json({status:'ok', user:token})
    }else{
        return res.json({status:'error', user:false})
    }
})

app.listen(1337, () => {
    console.log('Server start on 1337')
})