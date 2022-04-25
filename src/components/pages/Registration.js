import Field from '../page-components/Field';
import Button from '../page-components/Button';
import React,{useState,useEffect} from 'react';
import logout from '../page-components/Logout';
import "../css/style.css"
import axios from 'axios'

function Registration(){

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
            console.log(response.data)
        })
        },[levelUrl])
    

        if(levels.length !== 0){
            if(level!==''){
                if(level === levels[0]._id){
                    phases = levels[0].level
                }else if(level === levels[1]._id){
                    phases= levels[1].level
                }else if(level === level[2]._id){
                    phases = levels[2].level
                }
                else if(level === level[3]._id){
                    phases = levels[3].level
                }
            }
            else{
                console.log('no level selected yet')
            }
            
        }else{
            console.log('loading')
      
        }
        // console.log(level)
        
        // if(level!==''){
        //     if(phases !== null){
        //             for(let i = 1; i<=phases.length; i++  ){
        //                 console.log(i)
        //             }
                
        //     }
            
        // }

        function renderPhase(){
            
            if(level!==''){
                if(phases !== null){
                    let num =0 
                    return(
                        phases.map((phasess)=>(
                            <option value={num++} key={num} >Phase {num} {phasess}</option>
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
            if(password !== confirmPassword){
                errors.password="Passwords don't match"
                errors.confirmPassword="Passwords don't match"
            }
            
        }else if (!password || !confirmPassword){
            if(!password){errors.password="Password is required"}
            if(!confirmPassword)errors.confirmPassword="Confirm Password is required" 
        }
        
        if (!level){
            errors.level="Level is required"
        }

        if (!phase){
            errors.phase="Phase is required"
        }

        if (!area){
            errors.area="Area is required"
        }
        if (!type){
            errors.type="Account type is required"
        }
        return errors
    }


    function register(event){
        event.preventDefault();
        setFormErrors(validate(fName,lName,email,username,password,confirmPassword,level,phase,area,type))
        console.log(formErrors)
        if(Object.keys(formErrors).length === 0){
             console.log(fName,mName,lName,email,username,password,confirmPassword,level,phase,area,type)
             
             fetch('http://localhost:1337/cictdrive/sign_up',{
                 method: 'POST',
                 headers: {
                     'Content-Type':'application/json',
                     
                 },
                 body: JSON.stringify({
                     fName,mName,lName,email,username,password,level,phase,area,type
                 })
             }).then(res => res.json())
             .then(data => 
                 {
                     console.log(data)
                     if(data.status==="ok"){
                         alert('Succesfully Created!')
                         window.location.href = '/registration';
                     }else{
                         let existError = data.message;
                         let errorSplit = existError.split('_')
                         let usernameExist = errorSplit[0]
                         let emailExist = errorSplit[1]
                         setUnameExist(usernameExist)
                         setEmExist(emailExist)
                     }
                 }
                 )
 
         }
        // console.log(isSubmit)
        // setIsSubmit(true)
    }

    return(
        <div className="h-100">

                <div className="row navbar-static-top">
                    <div className="col">
                        
                        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                            <div className="container-fluid">
                                <a className="navbar-brand" href="/home">CICT Drive</a>

                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>

                                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                                    <div className="navbar-nav">
                                        <a className="nav-link" href="/home">Home</a>
                                        <a className="nav-link active" href="/registration">Registration</a>
                                        <a className="nav-link" href="#">Logs</a>
                                        <li className="nav-item dropdown">
                                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                My Account
                                            </a>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li><a className="dropdown-item" href="#">Update</a></li>
                                                <li><a className="dropdown-item" onClick={logout} href='#'>Sign Out</a></li>
                                            </ul>
                                        </li>
                                    </div>
                                </div>

                            </div>
                        </nav>   

                        </div>
                    </div>


                    <div className='row m-2 shadow-lg' style={{height: '90%'}}>

                        <div className='col-md-6 col-sm-12 d-none d-md-block bg-secondary'>
                            
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