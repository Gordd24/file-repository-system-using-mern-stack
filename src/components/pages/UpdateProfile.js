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

    const[fName,setFName] = useState('');
    const[mName,setMName] = useState('');
    const[lName,setLName] = useState('');
    const[password,setPassword] = useState('');
    const[confirmPassword,setConfirmPassword] = useState('');
    function updateName(e){
        e.preventDefault()
        console.log('First Name', fName)
        console.log('Last Name', lName)
        console.log('Middle Name', mName)

    }

    function updatePassword(e){
        e.preventDefault()
        console.log('Password', password)
        console.log('Confirm Password', confirmPassword)

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
                                                            <Field type="text" placeholder="First Name" required="*" setVal={setFName} val={fName}/>
                                                            <Field type="text" placeholder="Middle Name" required="" setVal={setMName} val={mName}/>
                                                            <Field type="text" placeholder="Last Name" required="*" setVal={setLName} val={lName}/>

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
                                                                <Field type="password" placeholder="Password" required="*" setVal={setPassword} val={password}/>
                                                                <Field type="password" placeholder="Confirm Password" required="*" setVal={setConfirmPassword} val={confirmPassword}/>
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