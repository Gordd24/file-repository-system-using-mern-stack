import Field from './Field';
import Button from './Button';
import React, {useState} from 'react';
import lib from './img/lib.jpg'

function SignIn(){

    const[username,setUsername] = useState('');
    const[password,setPassword] = useState('');



    function signIn(e) {
        e.preventDefault();
        console.log('Attempted to Sign In...');

        fetch('http://localhost:1337/sign_in',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                username,password
            })
        }).then(res => res.json()).then(data =>
            {
                if(data.status==='user-found'){
                    alert('Success Sign In!');
                    console.log(data.status);
                    window.location.href ='/home'
                }else{
                    alert('Invalid Username or Password!');
                    console.log(data.status);
                }
            }
        )
    }

    return(
       <div className="row h-100">

            <div className="col-md-6 col-sm-12 my-auto">    

                {/* login card */}
                <div className='row justify-content-center'>
                    <div className='col-10 border rounded shadow-lg py-5'>
                    
                        <div className='row mb-5 mx-3'>
                            <div className='col'>
                                <h1>CICT DRIVE</h1>
                            </div>
                        </div>

                       
                        <form onSubmit={signIn}>
                            <div className='row justify-content-center'>
                                <div className='col-10'>
                                    <div className='row mx-3'>
                                        <div className='col'>
                                            <h4>Sign in your account</h4>
                                        </div>
                                    </div>
                                    <Field type="text" placeholder="Username" setVal={setUsername} val={username}/>
                                    <Field type="password" placeholder="Password" setVal={setPassword} val={password}/>
                                </div>
                            </div>

                            <div className='row  justify-content-center'>
                                <div className='col-10'>
                                    <Button />
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
                {/* login card end */}

            </div>


           <div className="col-6 d-none d-md-block bg-warning" style={{ backgroundImage: `url(${lib})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>    

           </div>
       </div>
    )
}

export default SignIn;