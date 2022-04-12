import React from 'react';
import SignIn from './SignIn';
import Home from './Home';
import Registration from './Registration';
import { BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div className="h-100">
        {/* <BrowserRouter>
          <Routes>
            <Route path="/sign_in" element ={<SignIn />}/>
            <Route path="/home" element ={<Home />}/>
          </Routes>
        </BrowserRouter> */}

        <BrowserRouter>
          <Routes>
            <Route path="/" element ={<SignIn />}/>
            <Route path='/home' element={<Home/>}></Route>
            <Route path='/registration' element={<Registration/>}></Route>
          </Routes>
        </BrowserRouter>


    </div>
  );
}

export default App;
