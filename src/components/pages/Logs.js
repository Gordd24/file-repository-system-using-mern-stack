import React,{useState,useEffect} from 'react';
import Navigation from '../page-components/Navigation'
import "../css/style.css"
import axios from 'axios'
import bg9 from '../img/bg9.png'
import { Tab, Tabs , Table, Dropdown, DropdownButton} from 'react-bootstrap';
import LogFileRow from '../page-components/LogFileRow';
import ActionRow from '../page-components/ActionRow';
import moment from 'moment';

function Logs(){

    const logsUrl = 'http://localhost:1337/cictdrive/logs'
    const uploadedUrl = 'http://localhost:1337/cictdrive/file-uploads'
    
    const[upFiles,setUpFiles] = useState([])
    const[areaFiles,setAreaFiles] = useState([])
    const[actions,setActions] = useState([])
    const[areaVal,setAreaVal] = useState('')
    const handleAreaSelect = (e) =>{
        console.log(e)
        setAreaVal(e)
    }
    const[date, setDate] = useState('')
    const[actionDate, setActionDate] = useState('')
    const handleDateSelect = (e)=>{
        console.log(e)
        setDate(e)
    }
    const handleActionDateSelect = (e)=>{
        console.log(e)
        setActionDate(e)
    }
    //dates today, week, month
    const dateToday = moment().format('L'); 
    const dateLastWeek =moment().subtract(7, 'days').calendar();
    const dateLastMonth =moment().subtract(30, 'days').calendar();
   
    
    useEffect(()=>{
        
        axios.post(logsUrl).then(response =>{
            setActions(response.data)
           
        })
        axios.post(uploadedUrl).then(response =>{
            setUpFiles(response.data)
            setAreaFiles(response.data)
        })
        
    },[logsUrl])


    function renderFileLogs(){
        if(!moment(date).isValid()){
            
            return(
                upFiles.map((getUpFiles)=>(
                    getUpFiles.filename) &&
                    <LogFileRow filename={getUpFiles.filename} upload={moment(getUpFiles.date).format('L')} key={getUpFiles.filename}  />
                ))
        }

        else if(moment(date).isSame(dateToday)){
            
                return(
                    upFiles.map((getUpFiles)=>(
                        getUpFiles.filename && moment(moment(getUpFiles.date).format('L')).isSame(date) &&
                        <LogFileRow filename={getUpFiles.filename} upload={moment(getUpFiles.date).format('L')} key={getUpFiles.filename}  />
                    ))
                )
        }else{
            
                return(
                    upFiles.map((getUpFiles)=>(
                        getUpFiles.filename && moment(moment(getUpFiles.date).format('L')).isBetween(date,dateToday,undefined,"[]") &&
                        <LogFileRow filename={getUpFiles.filename} upload={moment(getUpFiles.date).format('L')} key={getUpFiles.filename}  />
                    ))
                )
            }
        }
    
    function renderAreaLogs(){
        
       if(!areaVal){
           
           return(
            areaFiles.map((getAreaFiles)=>(
                getAreaFiles.filename &&
               <LogFileRow filename={getAreaFiles.filename} upload={moment(getAreaFiles.date).format('L')} key={getAreaFiles.filename}/>
           ))
           )
       }else{
           
        return(
            areaFiles.map((getAreaFiles)=>(
                getAreaFiles.filename && getAreaFiles.areaDir === areaVal &&
               <LogFileRow filename={getAreaFiles.filename} upload={moment(getAreaFiles.date).format('L')} key={getAreaFiles.filename}/>
           ))
           )
       }

    }

    function renderActionLogs(){
            if(!moment(actionDate).isValid()){
                
                let num = 0;
                
                return(
                    actions.map((getActions)=>(
                        
                        <ActionRow user={getActions.user} action={getActions.action} date={moment(getActions.date).format('L')}key={num++}/>
                    ))
                )
            }
    
            
         else if(moment(actionDate).isSame(dateToday)){
                
                let num = 0;
                return(
                    actions.map((getActions)=>(
                        moment(moment(getActions.date).format('L')).isSame(actionDate) &&
                        <ActionRow user={getActions.user} action={getActions.action} date={moment(getActions.date).format('L')}key={num++} />
                    ))
                )
            }
            else{
                
                let num = 0;
                return(
                    actions.map((getActions)=>(
                        moment(moment(getActions.date).format('L')).isBetween(actionDate,dateToday,undefined,"[]") &&
                        <ActionRow user={getActions.user} action={getActions.action} date={moment(getActions.date).format('L')}key={num++} />
                    ))
                )
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
                                                        <DropdownButton variant="dark" id="dropdown-basic-button" title="View By " onSelect={handleDateSelect}>
                                                            <Dropdown.Item eventKey={dateToday}>This Day</Dropdown.Item>
                                                            <Dropdown.Item eventKey={dateLastWeek}>This Week</Dropdown.Item>
                                                            <Dropdown.Item eventKey={dateLastMonth}>This Month</Dropdown.Item>
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
                                                        {renderFileLogs()}
                                                        </tbody>
                                                        </Table>

                                                        </div>
                                                    </div>
                                                </Tab>
                                                <Tab eventKey="files" title="Area Files" className='px-3'>
                                                    <div className='row overflow-auto' style={{height: '80vh'}}>
                                                        <div className='col'>
                                                        <div className='my-2'>
                                                            <DropdownButton id="dropdown-basic-button" variant="dark" title="Select Area" onSelect={handleAreaSelect}>
                                                                <Dropdown.Item eventKey="1">Area 1</Dropdown.Item>
                                                                <Dropdown.Item eventKey="2">Area 2</Dropdown.Item>
                                                                <Dropdown.Item eventKey="3">Area 3</Dropdown.Item>
                                                                <Dropdown.Item eventKey="4">Area 4</Dropdown.Item>
                                                                <Dropdown.Item eventKey="5">Area 5</Dropdown.Item>
                                                                <Dropdown.Item eventKey="6">Area 6</Dropdown.Item>
                                                                <Dropdown.Item eventKey="7">Area 7</Dropdown.Item>
                                                                <Dropdown.Item eventKey="8">Area 8</Dropdown.Item>
                                                                <Dropdown.Item eventKey="9">Area 9</Dropdown.Item>
                                                                <Dropdown.Item eventKey="10">Area 10</Dropdown.Item>
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
                                                           {renderAreaLogs()}
                                                        </tbody>
                                                        </Table>

                                                        </div>
                                                        
                                                    </div>
                                                </Tab>
                                                <Tab eventKey="logs" title="Action Logs" className='px-3'>
                                                    <div className='row overflow-auto' style={{height: '80vh'}}>
                                                        <div className='col'>
                                                        <div className='my-2'>
                                                        <DropdownButton variant="dark" id="dropdown-basic-button" title="View By " onSelect={handleActionDateSelect}>
                                                            <Dropdown.Item eventKey={dateToday}>This Day</Dropdown.Item>
                                                            <Dropdown.Item eventKey={dateLastWeek}>This Week</Dropdown.Item>
                                                            <Dropdown.Item eventKey={dateLastMonth}>This Month</Dropdown.Item>
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
                                                           {renderActionLogs()}
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