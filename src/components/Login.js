import star from '../images/star.jpg';
import './main.css';
import {useState} from 'react'


function Login(){

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
  

    async function loginUser(e){
        e.preventDefault()
        const response = await fetch('http://localhost:1337/api/login',{
          method: 'POST',
          headers:{
              'Content-Type': 'application/json',
          },
            body: JSON.stringify({
              username,password,
            }),
        })
    
        const data = await response.json()
        console.log(data)
  
        if(data.user){
          localStorage.setItem('token', data.user)
          alert('login success')
          window.location.href ='/home'
        }else{
          alert('please check username password')
        }
      }
      

    return(
        <div className="row h-100">
             
             <div className="col-md-6 col-sm-12">

                <div className='row d-flex justify-content-center h-100'>
                    <div className='col-10 rounded my-auto p-3 shadow-lg'>
                            <div className='row mb-5'>
                                <div className='col-12'>
                                    <h1>CICT DRIVE</h1>
                                </div>
                            </div>
                        
                        <form onSubmit={loginUser}>

                            <div className='row my-3'>
                                <div className='col-12'>
                                    <h4>Sign in to your Account</h4>
                                </div>
                            </div>
                            
                            <div className='row  my-3'>
                                <div className='col-12'>
                                    <input type="text" className="form-control" id="username" value={username} onChange={(e)=> setUsername(e.target.value)} placeholder="Username" />
                                </div>
                            </div>


                            <div className='row  my-3'>
                                <div className='col-12'>
                                    <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} className="form-control" id="password" placeholder="Password" />
                                </div>
                            </div>


                            <div className='row  my-3'>
                                <div className='col-12'>
                                    <a href='#'><p>Forgot Password?</p></a>
                                </div>
                            </div>


                            <div className='row  my-2'>
                                <div className='col-12'>
                                    <input type="submit" className="submit form-control bg-primary text-light" id="submit" value="Sign In" />
                                </div>
                            </div>

                        </form>
                        
                    </div>
                </div>

            </div>

            <div className="col-6 d-none d-md-block full-img" style={{ backgroundImage: `url(${star})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>

           

        </div>

    );
}


export default Login;