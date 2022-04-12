import React from 'react';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Registration from './pages/Registration';
import { BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div className="h-100">
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
