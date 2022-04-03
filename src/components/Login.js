import star from '../images/star.jpg';
import './main.css';


function Login(){
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
                        
                        <form>

                            <div className='row my-3'>
                                <div className='col-12'>
                                    <h4>Sign in to your Account</h4>
                                </div>
                            </div>
                            
                            <div className='row  my-3'>
                                <div className='col-12'>
                                    <input type="text" className="form-control" id="username" placeholder="Username" />
                                </div>
                            </div>


                            <div className='row  my-3'>
                                <div className='col-12'>
                                    <input type="password" className="form-control" id="password" placeholder="Password" />
                                </div>
                            </div>


                            <div className='row  my-3'>
                                <div className='col-12'>
                                    <a href='#'><p>Forgot Password?</p></a>
                                </div>
                            </div>


                            <div className='row  my-2'>
                                <div className='col-12'>
                                    <input type="Submit" className="submit form-control bg-primary text-light" id="submit" value="Sign In" />
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