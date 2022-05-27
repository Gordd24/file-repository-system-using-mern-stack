import Field from '../page-components/Field';
import Button from '../page-components/Button';
import React,{useState,useEffect} from 'react';
import Navigation from '../page-components/Navigation'
import "../css/style.css"
import axios from 'axios'
import bg9 from '../img/bg9.png'
import jwt_decode from 'jwt-decode'
import {Modal} from 'react-bootstrap'

function Registration(){
       
    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    const decodeToken = jwt_decode(accessToken)
    const personName = decodeToken.fName + ' ' + decodeToken.lName

    const[fName,setFName] = useState('');
    const[mName,setMName] = useState('');
    const[lName,setLName] = useState('');
    const[email,setEmail] = useState('');
    const[username,setUsername] = useState('');
    const[password,setPassword] = useState('');
    const[confirmPassword,setConfirmPassword] = useState('');
    const[level,setLevel] = useState('');
    const[phase,setPhase] = useState('');
    const[area,setArea] = useState('');
    const[type,setType] = useState('');

    const handleClose = () => 
    {
        setShow(false);
        window.location.href = '/registration';
    }
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);

    // container current selected value of level
    
    const [formErrors, setFormErrors] = useState({})

    const [unameExist, setUnameExist] = useState('') 
    const [emExist, setEmExist] = useState('') 
    
    const [levels, setLevels] = useState([])

   
    const levelUrl = 'http://localhost:1337/cictdrive/levels'
        
    let phases = null
        useEffect(()=>{
            axios.get(levelUrl)
            .then(response => {
            setLevels(response.data)
            // console.log(response.data)
        })
        },[levelUrl])
    

        if(levels.length !== 0){
            if(level!==''){
                
                for (let i = 0; i <level;i++){      
                    phases = levels[i].level
                }
                
            }
            
        }else{
            console.log('loading')
        }
        

        function renderPhase(){
            
            if(level!==''){
                if(phases !== null){
                    let num =0 
                    return(
                        phases.map((phasess)=>(
                            <option value={++num} key={num} >Phase {num}</option>
                        ))
                    )
                }
                
            }
        }
        
        

    const validate = (fName,lName,email,username,password,confirmPassword,level,phase,area,type)=>{
        const errors = {}
        const regex =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (!fName){
            errors.fName="First name is required"
        }
        if (!lName){
            errors.lName="Last name is required"
        }
        if (!email){
            errors.email="Email is required"
        }else if(!regex.test(email)){
            errors.email="This email is not valid."
        }
        if (!username){
            errors.username="Username is required"
        }
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
        }
        else if (!password || !confirmPassword){
            if(!password)errors.password="Password is required"
            if(!confirmPassword)errors.confirmPassword="Confirm Password is required" 
        }
        if (!type){
            errors.type="Account type is required"
        }

        if(type==='faculty'){
            if (!level){
                errors.level="Level is required"
            }
    
            if (!phase){
                errors.phase="Phase is required"
            }
    
            if (!area){
                errors.area="Area is required"
            }
        }
        
        return errors
    }



    function register(event){
        event.preventDefault();
        setFormErrors(validate(fName,lName,email,username,password,confirmPassword,level,phase,area,type))
        //console.log(formErrors)
        if(Object.keys(formErrors).length === 0){
            //  console.log(fName,mName,lName,email,username,password,confirmPassword,level,phase,area,type)
             fetch('http://localhost:1337/cictdrive/sign_up',{
                 method: 'POST',
                 headers: {
                     'Content-Type':'application/json',
                     
                 },
                 body: JSON.stringify({
                     fName,mName,lName,email,username,password,level,phase,area,type,personName
                 })
             }).then(res => res.json())
             .then(data => 
                 {
                     console.log(data.message)
                     if(data.message==='success'){
                         handleShow()
                     
                     }else{
                         let existError = data.message;
                         console.log(existError)
                         if(existError === 'This username already exists'){
                            setUnameExist(existError)
                            
                         }
                         else if(existError === 'This email already exists'){
                            setEmExist(existError)
                            
                         }else{
                            
                            let errorSplit = existError.split('_')
                            let usernameExist = errorSplit[0]
                            let emailExist = errorSplit[1]
                            setUnameExist(usernameExist)
                            setEmExist(emailExist)
                            
                         }
                            
                         }

                     })
 
         }
        
    }

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
                                    You have successfully created a new account!
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

                        <div className='col-md-6 col-sm-12 d-none d-md-block bg-dark' style={{ backgroundImage: `url(${bg9})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                            <div className='row justify-content-right'>
                                <div className='col p-5 mt-5'>
                                    <h1 className='text-light'>
                                        CICT Drive Registration
                                    </h1>
                                    <h4 className='text-light m-4'>
                                       Create and Assign Faculty Members Account in just few easy steps!
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-6 col-sm-12'>

                            <div className='row align-items-center bg-dark text-light' style={{height: '8%'}}>
                                <div className='col'>
                                    <h4>Create An Account</h4>
                                </div>
                            </div>

                            
                            <div className='row' style={{height: '92%'}}>
                                <div className='col'>
                                    <form onSubmit={register}  style={{height:'100%'}}>

                                        <div className='row overflow-auto' style={{height: '74.5vh'}}>
                                            <div className='col'>

                                                <div className='row border rounded shadow mx-1 mt-3'>
                                                    <div className='col'>
                                                        <h5 className='border-bottom my-2 p-1'>Personal Name</h5>
                                                        <Field error={formErrors.fName} type="text" placeholder="First Name" required="*" setVal={setFName} val={fName}/>
                                                        <Field type="text" placeholder="Middle Name" required="" setVal={setMName} val={mName}/>
                                                        <Field error={formErrors.lName} type="text" placeholder="Last Name" required="*" setVal={setLName} val={lName}/>
                                                        
                                                    </div>
                                                </div>

                                                <div className='row border rounded mx-1 mt-3 shadow'>
                                                    <div className='col'>
                                                        <h5 className='my-2 p-1 border-bottom p-2'>Account Credentials</h5>
                                                        <Field error={formErrors.email} errorExist={emExist} type="email" placeholder="Email" required="*" setVal={setEmail} val={email}/>
                                                        
                                                        <Field error={formErrors.username} errorExist={unameExist} type="text" placeholder="Username" required="*" setVal={setUsername} val={username}/>
                                                        
                                                        <Field error={formErrors.password} type="password" placeholder="Password" required="*" setVal={setPassword} val={password}/>
                                                        
                                                        <Field error={formErrors.confirmPassword} type="password" placeholder="Confirm Password" required="*" setVal={setConfirmPassword} val={confirmPassword}/>
                                                        
                                                    </div>
                                                </div>

                                                <div className='row border rounded mx-1 mt-3 mb-3 shadow'>
                                                    <div className='col'>
                                                        <h5 className='my-2 p-1 border-bottom p-2'>Account Assignment</h5>
                                                        <div className="row m-3">
                                                            <div className="col">
                                                                <select className="form-select" onChange={(e)=>setType(e.target.value)} value={type}>
                                                                    <option>Choose Account Type</option>
                                                                    <option value='faculty'>Faculty</option>
                                                                    <option value="accreditor">Accreditor</option>
                                                                    <option value="admin">Administrator</option>
                                                                </select>
                                                                <div className="error">{formErrors.type}</div>
                                                            </div>
                                                        </div>
                                                        {
                                                            type === "faculty" 
                                                            &&
                                                            <div>
                                                                <div className="row m-3">
                                                                    <div className="col">
                                                                        <select className="form-select" onChange={(e)=>setLevel(e.target.value)} value={level}>
                                                                            <option>Choose Level </option>
                                                                            {levels.map((getLevel)=>(
                                                                                <option key = {getLevel._id} value = {getLevel.value}>Level {getLevel.value}</option>
                                                                            ))}
                                                                        </select>
                                                                        <div className="error">{formErrors.level}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="row m-3">
                                                                <div className="col">
                                                                    <select className="form-select" onChange={(e)=>setPhase(e.target.value)} value={phase}>
                                                                        <option>Choose Phase</option>
                                                                        {renderPhase()}
                                                                    
                                                                    </select>
                                                                    <div className="error">{formErrors.phase}</div>
                                                                </div>
                                                            </div>
                                                            <div className="row m-3">
                                                                <div className="col">
                                                                    <select className="form-select" onChange={(e)=>setArea(e.target.value)} value={area}>
                                                                        <option>Choose Area Assignment</option>
                                                                        <option value='1'>Area 1</option>
                                                                        <option value="2">Area 2</option>
                                                                        <option value="3">Area 3</option>
                                                                        <option value="4">Area 4</option>
                                                                        <option value="5">Area 5</option>
                                                                        <option value="6">Area 6</option>
                                                                        <option value="7">Area 7</option>
                                                                        <option value="8">Area 8</option>
                                                                        <option value="9">Area 9</option>
                                                                        <option value="10">Area 10</option>
                                                                    </select>
                                                                    <div className="error">{formErrors.area}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        }
                                                        
                                                        

                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row align-items-center justify-content-end bg-dark' style={{height:'10%'}}>
                                            <div className='col-4'>
                                                <Button val="Create Account" btnType='btn-lg'/>
                                            </div>
                                        </div>

                                        
                               
                                    </form>
                                </div>
                            </div>

                        </div>

                    </div>


        </div>
    )
}


export default Registration;