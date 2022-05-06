import axios from "axios"
import jwt_decode from 'jwt-decode'
const logout = async(e)=> {
    e.preventDefault()
        try {
            //values from localstorage
        const user = localStorage.getItem('user')
        const object = JSON.parse(user)
        const accessToken = object.accessToken
        const decodeToken = jwt_decode(accessToken)
        const personName = decodeToken.fName + ' ' + decodeToken.lName

        const refreshToken = object.refreshToken
            if(window.confirm("Do you want to logout?")===true){
                axios.delete('http://localhost:1337/cictdrive/logout',{
                    headers:{
                        Authorization: 'Bearer '+object.accessToken
                    },
                    data:{
                        token: refreshToken,
                        personName: personName
                    }
                    
                })
                console.log('signed out')
                localStorage.removeItem('user')
                
                window.location.reload()
            }else{
                console.log('cancelled')
            }
        } catch (error) {
            console.log(error)
        }
        
    }
    
    export default logout;