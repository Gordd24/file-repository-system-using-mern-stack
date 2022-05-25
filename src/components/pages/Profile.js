import Field from '../page-components/Field';
import React,{useState,useEffect} from 'react';
import Navigation from '../page-components/Navigation'
import "../css/style.css"
import axios from 'axios'
import bg9 from '../img/bg9.png'
import tempPic from '../img/tempPic.png'
import jwt_decode from 'jwt-decode'
import {Modal, Button as ReactButton, Card} from 'react-bootstrap'
import ProfileCard from '../page-components/ProfileCard'
import {Buffer} from 'buffer'

function Profile(){

    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    const decodeToken = jwt_decode(accessToken)

    const[profilePic,setProfilePic] = useState(tempPic)
    const[fName,setFName] = useState(decodeToken.fName);
    const[mName,setMName] = useState(decodeToken.mName);
    const[lName,setLName] = useState(decodeToken.lName);
    const id = decodeToken.id
    const[password,setPassword] = useState('');
    const[confirmPassword,setConfirmPassword] = useState('')
    const [nameErrors, setNameErrors] = useState({})
    const [passwordErrors, setPasswordErrors] = useState({})
    const [profileCard, setProfileCard] = useState('')

    
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
        
        if(Object.keys(nameErrors).length === 0){


            axios.post('http://localhost:1337/cictdrive/update_name',({
                fName, mName, lName, id

            })).then(response =>{
                if(response.status ===200){
                    console.log(response.data)
                    
                    localStorage.setItem("user",JSON.stringify(response.data))
                    handleShow()
                   
                    
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
                    handleShow()
                    
                }
            })
   
            }
       
    }
    
     const [show, setShow] = useState(false);

     const handleClose = () => 
     {
         setShow(false);
        //setTimeout(() => window.location.reload(), 3000)
         window.location.reload();
     }
        const handleShow = () => setShow(true);

    useEffect(()=>{
        fetch('http://localhost:1337/cictdrive/load-user-profile',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                id:id
            })
        })
        .then(data=>data.json())
        .then(data=>{
            setProfileCard(<ProfileCard firstName={data.fName} middleName={data.mName} lastName={data.lName} email={data.email} acc_type={data.type} level={data.level} phase={data.phase} area={data.area} username={data.username} />)
            loadPicture()
        })
    },[])

    return(
        <div className="h-100">
                <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                    >
                            <Modal.Header closeButton>
                                <Modal.Title>Success!</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                    Update Success!
                            </Modal.Body>
                            <Modal.Footer>
                                <button className='btn btn-secondary' onClick={handleClose}>
                                    Close
                                </button>
                            </Modal.Footer>
                    </Modal>
                    <div className="row navbar-static-top">
                        <div className="col">
                            <Navigation />
                        </div>
                    </div>


                    <div className='row m-2 shadow-lg' style={{height: '90%'}}>

                        <div className='col-md-5 col-sm-12 d-none d-md-block bg-dark' style={{ backgroundImage: `url(${bg9})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                            <div className='row justify-content-right'>
                                <div className='col p-5 mt-5'>
                                    <h1 className='text-light'>
                                        Do you want to make some changes?
                                    </h1>
                                    <button className='btn-lg btn-primary mt-2' onClick={()=>window.location.href='/update-profile'}>Let's go</button>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-7 col-sm-12'>

                            <div className='row align-items-center bg-dark text-light' style={{height: '8%'}}>
                                <div className='col text-end'>
                                    <h4 className=''>{fName+"'s Profile"}</h4>
                                </div>
                            </div>

                            
                            <div className='row' style={{height: '92%'}}>
                                <div className='col'>

                                        <div className='row overflow-auto' style={{height: '82.6vh'}}>
                                            <div className='col'>
                                                
                                                <div className='row mx-1 mt-3 justify-content-center'>
                                                    <div className='col-4 p-2 border rounded shadow'>
                                                            <Card.Img variant="top" src={profilePic} />
                                                    </div>
                                                </div>

                                                {profileCard}


        
                                               
                                            </div>
                                        </div>

                                </div>
                            </div>

                        </div>

                       

                    </div>


        </div>
    )
}


export default Profile;