import { Navigate } from "react-router-dom"
import jwt_decode from 'jwt-decode'

const RedirectHome = ({children}) =>{
    const isLoggedIn = localStorage.getItem('user')
        if(isLoggedIn){
            return <Navigate to ="/Home"/>
        }
    return children
}

const RequireAuth = ({children}) =>{
    const isLoggedIn = localStorage.getItem('user')
        if(!isLoggedIn){
            return <Navigate to ="/"/>
        }
    return children
}

const AdminCheck = ({children}) =>{
    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    //decode the access token
    const decodeToken = jwt_decode(accessToken)
    const accountType= decodeToken.type
        if(accountType !== 'admin'){
            //send sa home
            //bawal magpunta sa registration
            //bawal magcreate ng levels
            // alert('you are not authorized to view this page')
            return <Navigate to = "/Home"/>
        }
        return children
}


export {RedirectHome, RequireAuth, AdminCheck}