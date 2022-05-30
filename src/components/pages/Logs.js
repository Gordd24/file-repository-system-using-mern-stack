import React,{useState,useEffect} from 'react';
import Navigation from '../page-components/Navigation'
import "../css/style.css"
import axios from 'axios'
import bg9 from '../img/bg9.png'
import { Tab, Tabs , Table, Dropdown, DropdownButton,Form,Button} from 'react-bootstrap';
import LogFileRow from '../page-components/LogFileRow';
import ActionRow from '../page-components/ActionRow';
import moment from 'moment';
import jwt_decode from 'jwt-decode'

function Logs(){

    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    const decodeToken = jwt_decode(accessToken)
    
    const logsUrl = 'http://localhost:1337/cictdrive/logs'
    const uploadedUrl = 'http://localhost:1337/cictdrive/file-uploads'
    
    const[upFiles,setUpFiles] = useState([])
    const[areaFiles,setAreaFiles] = useState([])
    const[actions,setActions] = useState([])

    const[levelVal,setLevelVal] = useState('')
    const[phaseVal,setPhaseVal] = useState('')
    const[areaVal,setAreaVal] = useState('')

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
            if(levelVal!==''){
                for (let i = 0; i <levelVal;i++){      
                    phases = levels[i].level
                }
            }
            
        }else{
            console.log('loading')
        }

        function renderPhase(){
            
            if(levelVal!==''){
                if(!phases){
                    console.log('no phase')
                }else{
                    let num =0 
                    return(
                        phases.map((phasess)=>(
                            <option value={++num} key={num} >Phase {num}</option>
                        ))
                    )
                }
                
                
            }
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
        
       if(!levelVal && !phaseVal && !areaVal ){
           return(
            areaFiles.map((getAreaFiles)=>(
                getAreaFiles.filename &&
               <LogFileRow filename={getAreaFiles.filename} upload={moment(getAreaFiles.date).format('L')} key={getAreaFiles.filename}/>
           ))
           )
       }else if(levelVal && !phaseVal && !areaVal){
        return(
            areaFiles.map((getAreaFiles)=>(
                getAreaFiles.filename && 
                getAreaFiles.levelDir === levelVal && 
               <LogFileRow filename={getAreaFiles.filename} upload={moment(getAreaFiles.date).format('L')} key={getAreaFiles.filename}/>
           ))
           )
       }else if(levelVal && phaseVal && !areaVal){
        return(
            areaFiles.map((getAreaFiles)=>(
                getAreaFiles.filename && 
                getAreaFiles.levelDir === levelVal && 
                getAreaFiles.phaseDir === phaseVal &&
               <LogFileRow filename={getAreaFiles.filename} upload={moment(getAreaFiles.date).format('L')} key={getAreaFiles.filename}/>
           ))
           )
       }else if(!levelVal && !phaseVal && areaVal){
        return(
            areaFiles.map((getAreaFiles)=>(
                getAreaFiles.filename && 
                
                getAreaFiles.areaDir === areaVal &&
               <LogFileRow filename={getAreaFiles.filename} upload={moment(getAreaFiles.date).format('L')} key={getAreaFiles.filename}/>
           ))
           )
       }else{
           
        return(
            areaFiles.map((getAreaFiles)=>(
                getAreaFiles.filename && 
                getAreaFiles.levelDir === levelVal && 
                getAreaFiles.phaseDir === phaseVal &&
                getAreaFiles.areaDir === areaVal &&
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


    function generateAction(){
        let reportRow = []
        if(!moment(actionDate).isValid()){
                
            actions.map((getActions)=>{
                    reportRow.push({name:getActions.user,action:getActions.action,date:moment(getActions.date).format('L')})
            })

        }else if(moment(actionDate).isSame(dateToday)){   
              
            actions.map((getActions)=>{
                if(moment(moment(getActions.date).format('L')).isSame(actionDate))
                {
                    reportRow.push({name:getActions.user,action:getActions.action,date:moment(getActions.date).format('L')})
                }
            })

        }else{

            actions.map((getActions)=>{
                if(moment(moment(getActions.date).format('L')).isBetween(actionDate,dateToday,undefined,"[]"))
                {
                    reportRow.push({name:getActions.user,action:getActions.action,date:moment(getActions.date).format('L')})
                }
            })
        
        }

        fetch('http://localhost:1337/cictdrive/generate-action/',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                uploader:decodeToken.fName+' '+decodeToken.lName,
                reportRow:reportRow,
                scope:actionDate,
                dateToday: dateToday,
                dateLastWeek:dateLastWeek,
                dateLastMonth:dateLastMonth
            })
        }).then(data=>data.json()).then(data=>{
            window.open('http://localhost:1337/cictdrive/download-action-report/', '_self');
        })
    }

    function generateFile(){
        let reportRow = []
        if(!moment(date).isValid()){
            upFiles.map((getUpFiles)=>{
                    reportRow.push({filename:getUpFiles.filename,date:moment(getUpFiles.date).format('L')})
            })
        }

        else if(moment(date).isSame(dateToday)){
            upFiles.map((getUpFiles)=>{
                if(moment(moment(getUpFiles.date).format('L')).isSame(date))
                {
                    reportRow.push({filename:getUpFiles.filename,date:moment(getUpFiles.date).format('L')})
                }
            })
        }else{
            upFiles.map((getUpFiles)=>{
                if(moment(moment(getUpFiles.date).format('L')).isBetween(date,dateToday,undefined,"[]"))
                {
                    reportRow.push({filename:getUpFiles.filename,date:moment(getUpFiles.date).format('L')})
                }
            })
        }
       

        fetch('http://localhost:1337/cictdrive/generate-file/',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                uploader:decodeToken.fName+' '+decodeToken.lName,
                reportRow:reportRow,
                scope:date,
                dateToday: dateToday,
                dateLastWeek:dateLastWeek,
                dateLastMonth:dateLastMonth
            })
        }).then(data=>data.json()).then(data=>{
            window.open('http://localhost:1337/cictdrive/download-file-report/', '_self');
        })
    }


    function generateArea(){
        let reportRow = []
        if(!areaVal){
            areaFiles.map((getAreaFiles)=>{
                    reportRow.push({filename:getAreaFiles.filename,date:moment(getAreaFiles.date).format('L')})
            })
        }else{            
            areaFiles.map((getAreaFiles)=>{
                if(getAreaFiles.areaDir === areaVal)
                {
                    reportRow.push({filename:getAreaFiles.filename,date:moment(getAreaFiles.date).format('L')})
                }
            })
        }

        fetch('http://localhost:1337/cictdrive/generate-area/',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                uploader:decodeToken.fName+' '+decodeToken.lName,
                reportRow:reportRow,
                scope:areaVal,
            })
        }).then(data=>data.json()).then(data=>{
            window.open('http://localhost:1337/cictdrive/download-area-report/', '_self');
        })
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

                                                        <div className='row p-2'>
                                                            <div className='col'>
                                                                <DropdownButton variant="dark" id="dropdown-basic-button" title="View By " onSelect={handleDateSelect}>
                                                                    <Dropdown.Item eventKey={dateToday}>This Day</Dropdown.Item>
                                                                    <Dropdown.Item eventKey={dateLastWeek}>This Week</Dropdown.Item>
                                                                    <Dropdown.Item eventKey={dateLastMonth}>This Month</Dropdown.Item>
                                                                </DropdownButton> 
                                                            </div>
                                                            <div className='col text-end'>
                                                                <button className='btn btn-primary shadow' onClick={generateFile}>Create Report</button>
                                                            </div>
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
                                                        <form> 
                                                        <div className='row p-2'>
                                                                       
                                                                <div className='col'>
                                                                        <Form.Select aria-label="Default select example" onChange={(e)=>setLevelVal(e.target.value)} value={levelVal}>
                                                                            <option>--Level--</option>
                                                                            {levels.map((getLevel)=>(
                                                                                <option key = {getLevel._id} value = {getLevel.value}>Level {getLevel.value}</option>
                                                                            ))}
                                                                        </Form.Select>
                                                                </div>
                                                                <div className='col'>
                                                                        <Form.Select aria-label="Default select example" onChange={(e)=>setPhaseVal(e.target.value)} value={phaseVal}>
                                                                            <option>--Phase--</option>
                                                                            {renderPhase()}
                                                                        </Form.Select>
                                                                </div>
                                                                <div className='col'>
                                                                        <Form.Select aria-label="Default select example" onChange={(e)=>setAreaVal(e.target.value)} value={areaVal}>
                                                                            <option>--Area--</option>
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
                                                                        </Form.Select>
                                                                </div>
                                                            
                                                                <div className='col text-end'>
                                                                    <button className='btn btn-primary shadow' onClick={generateArea}>Create Report</button>
                                                                </div>
                                                        </div>
                                                        </form>
                                                        
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
                                                        <div className='row p-2'>
                                                            <div className='col'>
                                                                <DropdownButton variant="dark" id="dropdown-basic-button" title="View By " onSelect={handleActionDateSelect}>
                                                                    <Dropdown.Item eventKey={dateToday}>This Day</Dropdown.Item>
                                                                    <Dropdown.Item eventKey={dateLastWeek}>This Week</Dropdown.Item>
                                                                    <Dropdown.Item eventKey={dateLastMonth}>This Month</Dropdown.Item>
                                                                </DropdownButton>
                                                            </div>
                                                            <div className='col text-end'>
                                                                <button className='btn btn-primary shadow' onClick={generateAction}>Create Report</button>
                                                            </div>
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