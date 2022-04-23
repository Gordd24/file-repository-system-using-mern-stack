import React from 'react';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Level from './pages/Level';
import Phase from './pages/Phase';
import Registration from './pages/Registration';
import { BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <div className="h-100">
        <BrowserRouter>
          <Routes>
            <Route path="/" element ={<SignIn />}/>
            <Route path='/home' element={<Home/>}></Route>
            <Route path='/home/level/:id' element={<Level/>}></Route>
            <Route path='/home/level/:id/:phaseId' element={<Phase/>}></Route>
            <Route path='/registration' element={<Registration/>}></Route>
          </Routes>
        </BrowserRouter>


    </div>
  );
}

export default App;
