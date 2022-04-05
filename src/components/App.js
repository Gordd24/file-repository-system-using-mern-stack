import React from "react"
import Login from "./Login";
import Home from "./Home"

import { BrowserRouter, Route} from 'react-router-dom'

const App = () =>{
  return(
    <div>
        <BrowserRouter>
            <Route path="/login" exact component ={Login}/>
            <Route path="/home" exact component ={Home}/>
        </BrowserRouter>
    </div>
  )
}

// function App() {
//   return (
//     <Login />
//   );
// }

export default App;
