import React,{useState,useEffect} from 'react';
import Navigation from '../page-components/Navigation'
import "../css/style.css"
import axios from 'axios'
import bg9 from '../img/bg9.png'
import { Tab, Tabs , Table, Dropdown, DropdownButton} from 'react-bootstrap';
import LogFileRow from '../page-components/LogFileRow';
import ActionRow from '../page-components/ActionRow';

function Logs(){
    const[upFiles,setUpFiles] = useState([])
    const[areaFiles,setAreaFiles] = useState([])
    const[actions,setActions] = useState([])
    useEffect(()=>{
        setUpFiles([<LogFileRow filename='text.txt' upload='12/12/12' key={1} />])
        setAreaFiles([<LogFileRow filename='textFinal.txt' upload='12/12/12' key={1} />])
        setActions([<ActionRow user="jasper" action="creates" date="10/10/10"/>])
    },[])

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
                                                        <div className='my-2'>
                                                        <DropdownButton variant="dark" id="dropdown-basic-button" title="View By ">
                                                            <Dropdown.Item href="#">This Day</Dropdown.Item>
                                                            <Dropdown.Item href="#">This Week</Dropdown.Item>
                                                            <Dropdown.Item href="#">This Month</Dropdown.Item>
                                                        </DropdownButton>
                                                        </div>
                                                        <Table striped bordered hover>
                                                        <thead>
                                                            <tr>
                                                            <th>Filename</th>
                                                            <th>Upload Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                           {upFiles}
                                                        </tbody>
                                                        </Table>

                                                        </div>
                                                    </div>
                                                </Tab>
                                                <Tab eventKey="files" title="Area Files" className='px-3'>
                                                    <div className='row overflow-auto' style={{height: '80vh'}}>
                                                        <div className='col'>
                                                        <div className='my-2'>
                                                            <DropdownButton id="dropdown-basic-button" variant="dark" title="Select Area">
                                                                <Dropdown.Item href="#\">Area 1</Dropdown.Item>
                                                                <Dropdown.Item href="#\">Area 2</Dropdown.Item>
                                                                <Dropdown.Item href="#\">Area 3</Dropdown.Item>
                                                                <Dropdown.Item href="#\">Area 4</Dropdown.Item>
                                                                <Dropdown.Item href="#\">Area 5</Dropdown.Item>
                                                                <Dropdown.Item href="#\">Area 6</Dropdown.Item>
                                                                <Dropdown.Item href="#\">Area 7</Dropdown.Item>
                                                                <Dropdown.Item href="#\">Area 8</Dropdown.Item>
                                                                <Dropdown.Item href="#\">Area 9</Dropdown.Item>
                                                                <Dropdown.Item href="#\">Area 10</Dropdown.Item>
                                                            </DropdownButton>
                                                        </div>

                                                        <Table striped bordered hover>
                                                        <thead>
                                                            <tr>
                                                            <th>Filename</th>
                                                            <th>Upload Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                           {areaFiles}
                                                        </tbody>
                                                        </Table>

                                                        </div>
                                                        
                                                    </div>
                                                </Tab>
                                                <Tab eventKey="logs" title="Action Logs" className='px-3'>
                                                    <div className='row overflow-auto' style={{height: '80vh'}}>
                                                        <div className='col'>
                                                        <div className='my-2'>
                                                        <DropdownButton variant="dark" id="dropdown-basic-button" title="View By ">
                                                            <Dropdown.Item href="#">This Day</Dropdown.Item>
                                                            <Dropdown.Item href="#">This Week</Dropdown.Item>
                                                            <Dropdown.Item href="#">This Month</Dropdown.Item>
                                                        </DropdownButton>
                                                        </div>
                                                        <Table striped bordered hover>
                                                        <thead>
                                                            <tr>
                                                            <th>User</th>
                                                            <th>Action</th>
                                                            <th>Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                           {actions}
                                                        </tbody>
                                                        </Table>
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