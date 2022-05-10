import Field from '../page-components/Field';
import Button from '../page-components/Button';
import React,{useState,useEffect} from 'react';
import Navigation from '../page-components/Navigation'
import "../css/style.css"
import axios from 'axios'
import bg14 from '../img/bg14.png'
import bg15 from '../img/bg15.png'
import jwt_decode from 'jwt-decode'

function UpdateProfile(){

    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    const decodeToken = jwt_decode(accessToken)

    
    const[fName,setFName] = useState(decodeToken.fName);
    const[mName,setMName] = useState(decodeToken.mName);
    const[lName,setLName] = useState(decodeToken.lName);
    const id = decodeToken.id
    const[password,setPassword] = useState('');
    const[confirmPassword,setConfirmPassword] = useState('')
    const [nameErrors, setNameErrors] = useState({})
    const [passwordErrors, setPasswordErrors] = useState({})

    const validateName = (fName,lName)=>{
        const errors = {}

        if (!fName){
            errors.fName="First name is required"
        }
        if (!lName){
            errors.lName="Last name is required"
        }
        return errors
    }

    const validatePassword = (password,confirmPassword)=>{
        const errors = {}

        if (!password || !confirmPassword){
            if(!password)errors.password="Password is required"
            if(!confirmPassword)errors.confirmPassword="Confirm Password is required" 
        }else{
            if(password !== confirmPassword){
                errors.password="Passwords don't match"
                errors.confirmPassword="Passwords don't match"
            }
        }
        
        return errors
    }

    const updateName = (e)=>{
        e.preventDefault()
        setNameErrors(validateName(fName,lName))
        
        try{
            if(Object.keys(nameErrors).length === 0){
                const response =  axios.post('http://localhost:1337/cictdrive/update_name',({
                    fName, mName, lName, id
                
                if(response.status ===200){
                    console.log(response.data)
                    localStorage.setItem("user",JSON.stringify(response.data))
                    window.location.reload()
                    
                }else{
                    console.log(response.data)
                    //valdation dito
                }
            }
        }catch(error){
            console.log(error)
        }
    }
    const updatePassword = (e)=>{
        e.preventDefault()
        setPasswordErrors(validatePassword(password,confirmPassword))
        try {
            if(Object.keys(passwordErrors).length === 0){
                const response =  axios.post('http://localhost:1337/cictdrive/update_password',({
                    password, confirmPassword, id
                }))
                if (response.status === 200){
                    alert(response.data.message)
                    window.location.reload()
                }else{
                    console.log(response.data)
                }
                window.location.reload()
            }
        } catch (error) {
            console.log(error)
        }
    }
    

    

    return(
        <div className="h-100">

                    <div className="row navbar-static-top">
                        <div className="col">
                            <Navigation />
                        </div>
                    </div>


                    <div className='row m-2 shadow-lg' style={{height: '90%'}}>

                        <div className='col-md-6 col-sm-12'>

                            <div className='row align-items-center bg-dark text-light' style={{height: '8%'}}>
                                <div className='col'>
                                    <h4>My Profile</h4>
                                </div>
                            </div>

                            
                            <div className='row' style={{height: '92%'}}>
                                <div className='col'>

                                        <div className='row overflow-auto' style={{height: '82.6vh'}}>
                                            <div className='col'>
                                                
                                                <div className='row border rounded shadow mx-1 mt-3'>
                                                    <div className='col'>
                                                        <form onSubmit={updateName}>
                                                            <h5 className='border-bottom my-2 p-1'>Name</h5>
                                                            <Field error={nameErrors.fName} type="text" placeholder="First Name" required="*" setVal={setFName} val={fName}/>
                                                            <Field type="text" placeholder="Middle Name" required="" setVal={setMName} val={mName ?? ""}/>
                                                            <Field error={nameErrors.lName} type="text" placeholder="Last Name" required="*" setVal={setLName} val={lName}/>

                                                            <div className='row m-3 justify-content-center'>
                                                                <div className='col-5'>
                                                                <button type='submit' value='fullname' className='btn btn-primary form-control'>Save Changes</button>
                                                                </div>
                                                            </div>
                                                            
                                                        </form>
                                                    </div>
                                                </div>

                                                <div className='row border rounded shadow mx-1 mt-3 mb-3'>
                                                    <div className='col'>
                                                        <form onSubmit={updatePassword}>
                                                            <h5 className='border-bottom my-2 p-1'>Password</h5>
                                                                <Field  error={passwordErrors.password} type="password" placeholder="Password" required="*" setVal={setPassword} val={password}/>
                                                                <Field  error={passwordErrors.confirmPassword} type="password" placeholder="Confirm Password" required="*" setVal={setConfirmPassword} val={confirmPassword}/>
                                                            <div className='row m-3 justify-content-center'>
                                                                <div className='col-5'>
                                                                <button type='submit' value='fullname' className='btn btn-primary form-control'>Save Changes</button>
                                                                </div>
                                                            </div>
                                                            
                                                        </form>
                                                    </div>
                                                </div>


        
                                               
                                            </div>
                                        </div>

                                </div>
                            </div>

                        </div>

                        <div className='col-md-6 col-sm-12 d-none d-md-block bg-dark' style={{ backgroundImage: `url(${bg14})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                            <div className='row justify-content-right'>
                                <div className='col p-5 mt-5'>
                                    <h1 className='text-light'>
                                        Hello There! It's been a while!
                                    </h1>
                                    <h4 className='text-light m-4'>
                                       Keep your profile up to date champ!
                                    </h4>
                                </div>
                            </div>
                        </div>

                    </div>


        </div>
    )
}


export default UpdateProfile;