import Field from '../page-components/Field';
import Button from '../page-components/Button';
import React, {useState} from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode'

function SignIn(){
    

    const[username,setUsername] = useState('');
    const[password,setPassword] = useState('');
    const[user,setUser] = useState(null)

    const refreshToken = async()=>{
        try {
            const response = await axios.post('http://localhost:1337/cictdrive/refresh')
            setUser({
                //spread syntax daw ung ... di ko masyado gets pero iniispread nya daw ung laman ng arrays??
                ...user,
                accessToken : response.data.accessToken,
                refreshToken : response.data.refreshToken,
            })
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
    //axios instance
    const axiosRefresh = axios.create()

    //para mag auto refresh ung token
    //if expired na ung token, tatawagin ito
    axiosRefresh.interceptors.request.use(async (config) =>{
        let currentDate = new Date()
        const decodeToken = jwt_decode(user.accessToken)

        // checheck  kung expired na ung access token 
        if(decodeToken.exp *1000 < currentDate.getTime()){
            const data = await refreshToken()
            config.headers['authorization'] = "Bearer " + data.accessToken
        }
        return config
    },(error)=> {
        //pag may error, cancel
        return Promise.reject(error)
    })
    
    
    const signIn = async (e) =>{
        e.preventDefault()
        try {
            //api request
            const response = await axios.post('http://localhost:1337/cictdrive/sign_in',({
                username,password
            }))
            setUser(response.data)
            if(response.data.accessToken){
                if(response.status === 200){
                    localStorage.setItem('user', JSON.stringify(response.data))
                    window.location.href  = '/home'
                }
            }
            // console.log(response.data)
        } catch (error) {
            alert('Username or password is incorrect')
            console.log(error)
        }
    } 

    /* function signIn(e) {
        e.preventDefault();
        console.log('Attempted to Sign In...');
       

        fetch('http://localhost:1337/cictdrive/sign_in',{
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
    } */

    return(
       <div className="row h-100">
            
            <div className="col-md-6 col-sm-12 my-auto">    

                {/* login card */}
                <div className='row justify-content-center'>
                    <div className='col-10 bg-dark text-light border rounded shadow-lg py-5'>
                    
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
                                    <Field type="text" placeholder="Username" required="" setVal={setUsername} val={username}/>
                                    <Field type="password" placeholder="Password" required="" setVal={setPassword} val={password}/>
                                </div>
                            </div>

                            <div className='row  justify-content-center mx-3'>
                                <div className='col-10'>
                                    <Button val="Sign In"/>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
                {/* login card end */}

            </div>


           {/* <div className="col-6 d-none d-md-block" style={{ backgroundImage: `url(${lib})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>     */}
           <div className="col-6 d-none d-md-block bg-secondary">    
           </div>
       </div>
    )
}

export default SignIn;