import lib from './img/lib.jpg';
import Field from './Field';
import Button from './Button';
import React,{useState} from 'react';

function Registration(){


    function logout(event){
        event.preventDefault()
    
        if(window.confirm("Do you want to logout?")===true){
            console.log('signed out')
            window.location.href = '/sign_in'
        }else{
            console.log('cancelled')
        }
        
    }

    const[fName,setFName] = useState('');
    const[mName,setMName] = useState('');
    const[lName,setLName] = useState('');
    const[email,setEmail] = useState('');
    const[username,setUsername] = useState('');
    const[password,setPassword] = useState('');
    const[confirmPassword,setConfirmPassword] = useState('');
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

                    <div className="row m-2 shadow-lg">
                       
                        <div className="col-md-6 col-sm-12 d-none d-md-block bg-success" style={{ height: '90vh', backgroundImage: `url(${lib})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>

                        </div>

                        <div className="col-md-6 col-sm-12" style={{ height: '90vh'}}>

                            <div className='row bg-dark text-white align-items-center' style={{ height: '10%'}}>
                                <div className='col'>
                                    <h4>Create An Account</h4>
                                </div>
                            </div>

                            <div className='row overflow-auto' style={{ height: '80%'}}>
                                <div className='col'>

                                    <form>

                                        <div className='row border rounded my-4 mx-2 shadow'>
                                            <div className='col'>
                                                <h5 className='my-2 p-1 border-bottom'>Personal Name</h5>
                                                <Field type="text" placeholder="First Name" setVal={setFName} val={fName}/>
                                                <Field type="text" placeholder="Middle Name" setVal={setMName} val={mName}/>
                                                <Field type="text" placeholder="Last Name" setVal={setLName} val={lName}/>
                                            </div>
                                        </div>
                                        
                                        <div className='row border rounded my-4 mx-2 shadow'>
                                            <div className='col'>
                                                <h5 className='my-2 p-1 border-bottom'>Account Credentials</h5>
                                                <Field type="email" placeholder="Email" setVal={setEmail} val={email}/>
                                                <Field type="text" placeholder="Username" setVal={setUsername} val={username}/>
                                                <Field type="password" placeholder="Password" setVal={setPassword} val={password}/>
                                                <Field type="password" placeholder="Confirm Password" setVal={setConfirmPassword} val={confirmPassword}/>
                                            </div>
                                        </div>

                                        <div className='row border rounded my-4 mx-2 shadow'>
                                            <div className='col'>
                                                <h5 className='my-2 p-1 border-bottom'>Account Assignment</h5>


                                                
                                                <div className="row m-3">
                                                    <div className="col">
                                                        <select className="form-select">
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
                                                    </div>
                                                </div>

                                                <div className="row m-3">
                                                    <div className="col">
                                                        <select className="form-select">
                                                            <option>Choose Account Type</option>
                                                            <option value='faculty'>Faculty</option>
                                                            <option value="accreditors">Accreditor</option>
                                                            <option value="admin">Administrator</option>
                                                        </select>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </form>
                                    
                                </div>
                            </div>


                            <div className='row bg-dark text-white justify-content-center align-items-center' style={{ height: '10%'}}>
                                <div className='col-5'>
                                    <Button val="Create Account" btnType="btn-lg"/>
                                </div>
                            </div>
                           
                        </div>

                    </div>


        </div>
    )
}


export default Registration;