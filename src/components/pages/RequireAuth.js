import { Navigate } from "react-router-dom"

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

export {RedirectHome, RequireAuth}