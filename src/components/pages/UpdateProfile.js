import Field from '../page-components/Field';
import Button from '../page-components/Button';
import React,{useState,useEffect} from 'react';
import Navigation from '../page-components/Navigation'
import "../css/style.css"
import axios from 'axios'
import bg9 from '../img/bg9.png'
import jwt_decode from 'jwt-decode'
import {Modal, Button as ReactButton,Card} from 'react-bootstrap'
import tempPic from '../img/tempPic.png'
var Buffer = require('buffer/').Buffer

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
    const[profilePic,setProfilePic] = useState(tempPic)
    const [imgFile, setImgFile] = useState('');

    useEffect(()=>{
        loadPicture()
    },[])
      
    const handleSetImg = (e) => {
        setImgFile(e.target.files[0]);
    };

    const uploadImg = (e) => {

        const data = new FormData();
        data.append('img',imgFile)
        data.append('id',id)

        fetch("http://localhost:1337/cictdrive/upload-profile-pic", {
             method: 'POST',
             body:data,
        }).then(data=>data.json()).then(data=>{
            loadPicture()
            handleShowLeave()
            
        })
    };

    const loadPicture = () => {
        fetch("http://localhost:1337/cictdrive/load-profile-pic",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                id:id
            })
        }).then(data=>data.json()).then(data=>{
            if(data.file!=='none'){
                const base64String = Buffer.from(data.file.data).toString('base64')
                setProfilePic(`data:image/png;base64,${base64String}`)
            }
        })
    }

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

        if (password && confirmPassword){
            
            if(password.length<=6){
                errors.password="Passwords must be atleast 7 characters"
                errors.confirmPassword=""
            }
            //uppercase
            else if(!password.match(/[A-Z]/g)){
                errors.password="Password must contain atleast 1 uppercase letter"
                errors.confirmPassword=""
            }
            //lowercase
            else if(!password.match(/[a-z]/g)){
                errors.password="Password must contain atleast 1 lowercase letter"
                errors.confirmPassword=""
            }
            //number
            else if(!password.match(/[0-9]/g)){
                errors.password="Password must contain atleast 1 number"
                errors.confirmPassword=""
            }
            //special characters
            else if(!password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)){
                errors.password="Password must contain atleast 1 special character"
                errors.confirmPassword=""
            }
            else{
                if(password !== confirmPassword){
                    errors.password="Passwords don't match"
                    errors.confirmPassword="Passwords don't match"
                }
            }
           
            
            
        }else if (!password || !confirmPassword){
            if(!password)errors.password="Password is required"
            if(!confirmPassword)errors.confirmPassword="Confirm Password is required" 
        }
        
        return errors
    }

    const updateName = (e)=>{
        e.preventDefault()
        setNameErrors(validateName(fName,lName))
        
        if(Object.keys(nameErrors).length === 0){


            axios.post('http://localhost:1337/cictdrive/update_name',({
                fName, mName, lName, id

            })).then(response =>{
                if(response.status ===200){
                    console.log(response.data)
                    
                    localStorage.setItem("user",JSON.stringify(response.data))
                    handleShowLeave()
                   
                    
                }
            })

            
        }
    }
    const updatePassword = (e)=>{
        e.preventDefault()
        setPasswordErrors(validatePassword(password,confirmPassword))

            if(Object.keys(passwordErrors).length === 0){

                axios.post('http://localhost:1337/cictdrive/update_password',({
                    password, confirmPassword, id

            })).then(response =>{
                if(response.status ===200){
                    console.log(response.data)
                    handleShowLeave()
                    
                }
            })
   
            }
       
    }


    const [showLeave, setShowLeave] = useState(false);

    const handleCloseLeave = () => 
    {
        setShowLeave(false);
        window.location.href='/update-profile'
    }
    const handleShowLeave = () => 
    {
        setShowLeave(true);
        
    }
      

    return(
        <div className="h-100">


                    <Modal show={showLeave} onHide={handleCloseLeave}>
                        <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>You have successfully made some changes, do you have something more to update?</Modal.Body>
                        <Modal.Footer>
                        <ReactButton variant="secondary" onClick={()=>window.location.href='/profile'}>
                            No
                        </ReactButton>
                        <ReactButton variant="primary" onClick={handleCloseLeave}>
                            Yes
                        </ReactButton>
                        </Modal.Footer>
                    </Modal>

                    <div className="row navbar-static-top">
                        <div className="col">
                            <Navigation />
                        </div>
                    </div>


                    <div className='row m-2 shadow-lg' style={{height: '90%'}}>

                        <div className='col-md-7 col-sm-12'>

                            <div className='row align-items-center bg-dark text-light' style={{height: '8%'}}>
                                <div className='col'>
                                    <h4>Profile Update</h4>
                                </div>
                            </div>

                            
                            <div className='row' style={{height: '92%'}}>
                                <div className='col'>

                                        <div className='row overflow-auto' style={{height: '82.6vh'}}>
                                            <div className='col'>

                                            <div className='row border rounded shadow mx-1 mt-3'>
                                                    <div className='col'>
                                                         
                                                            <div className='row mx-1 mt-3 justify-content-center'>
                                                                <div className='col-4 p-2 border rounded shadow'>
                                                                        <Card.Img variant="top" src={profilePic} />
                                                                </div>
                                                            </div>

                                                            <div className='row m-3 justify-content-center'>
                                                                <div className='col-12 col-sm-9 mt-1'>
                                                                    <input onChange={handleSetImg} accept="image/png, image/jpeg" type="file" className="form-control custom-file-input" id="inputGroupFile01"/>
                                                                </div>
                                                                <div className='col-12 col-sm-3 mt-1'>
                                                                <button onClick={uploadImg} type='submit' value='profilepic' className='btn btn-primary form-control'>Upload</button>
                                                                </div>
                                                            </div>
                                                    </div>
                                                </div>
                                                
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

                        <div className='col-md-5 col-sm-12 d-none d-md-block bg-dark' style={{ backgroundImage: `url(${bg9})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                            <div className='row justify-content-right'>
                                <div className='col p-5 mt-5'>
                                    <h1 className='text-light'>
                                        Hello there! It's been a while!
                                    </h1>
                                    <h4 className='text-light m-4'>
                                       Keep your profile up-to-date champ!
                                    </h4>
                                </div>
                            </div>
                        </div>

                    </div>


        </div>
    )
}


export default UpdateProfile;