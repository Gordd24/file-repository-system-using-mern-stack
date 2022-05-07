import React,{useState,useEffect} from 'react';
import Navigation from '../page-components/Navigation'
import "../css/style.css"
import axios from 'axios'
import bg9 from '../img/bg9.png'
import { Tab,Sonnet, Tabs } from 'react-bootstrap';

function Logs(){

    return(
        <div className="h-100">

                    <div className="row navbar-static-top">
                        <div className="col">
                            <Navigation />
                        </div>
                    </div>


                    <div className='row m-2 shadow-lg' style={{height: '90%'}}>

                        
                        <div className='col-md-3 col-sm-12 d-none d-md-block bg-dark' style={{ backgroundImage: `url(${bg9})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                            <div className='row justify-content-right'>
                                <div className='col p-3 mt-5'>
                                    <h1 className='text-light'>
                                        History Logs!
                                    </h1>
                                    <h4 className='text-light mt-4'>
                                       Go check what development and actions we've done.
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-9 col-sm-12'>

                            
                            <div className='row' style={{height: '100%'}}>
                                <div className='col p-2 bg-light shadow '>

                                        
                                            <Tabs defaultActiveKey="uploaded" id="uncontrolled-tab-example" className="mb-3">
                                                <Tab eventKey="uploaded" title="Uploaded Files" className='px-3'>
                                                    <div className='row overflow-auto' style={{height: '80vh'}}>
                                                        <div className='col'>

                                                        </div>
                                                    </div>
                                                </Tab>
                                                <Tab eventKey="files" title="Area Files">
                                                    <div className='row overflow-auto' style={{height: '80vh'}}>
                                                        <div className='col'>

                                                        </div>
                                                    </div>
                                                </Tab>
                                                <Tab eventKey="logs" title="Action Logs">
                                                    <div className='row overflow-auto' style={{height: '80vh'}}>
                                                        <div className='col'>

                                                        </div>
                                                    </div>
                                                </Tab>
                                            </Tabs>

        
                                               
                                           

                                </div>
                            </div>

                        </div>


                    </div>


        </div>
    )
}


export default Logs;