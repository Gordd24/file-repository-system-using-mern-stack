import React, { useEffect } from "react";
import jwt_decode from "jwt-decode"
import {useHistory} from 'react-router-dom';

const Home = () =>{
    const history = useHistory()

    async function populateQuote() {
        const req = await fetch('http://localhost:1337/api/quote',{
            
            headers:{
                'x-access-token': localStorage.getItem('token'),
            },
        })

        const data = req.json()
        console.log(data)
      }

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(token){
            const user =jwt_decode(token)
            if(!user){
                localStorage.removeItem('token')
                history.replace('/login')
            }else{
                populateQuote()
            }
        }
    }) 
    

    return <h1>Hello</h1>
}

export default Home