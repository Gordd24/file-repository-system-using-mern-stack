import Navigation from '../page-components/Navigation'
import ParamCard from '../page-components/ParamCard';
import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Dropdown, DropdownButton, Modal, Button } from 'react-bootstrap';
import bg4 from '../img/bg4.png'
import bg6 from '../img/bg6.png'
import jwt_decode from 'jwt-decode'

function Area(props){
    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    const decodeToken = jwt_decode(accessToken)
    const personName = decodeToken.fName + ' ' + decodeToken.lName
    const params = useParams()

    const currentAreaURL = params.id+'/'+params.phaseId+'/'+params.areaId
    const userAreaURL = decodeToken.level+'/'+ decodeToken.phase+'/'+ decodeToken.area
    
    const accountType = decodeToken.type
    const[parameterComps,setParameterComps] = useState([])
    const[parameters,setParameters] = useState([])
    const[paramName,setParamName] = useState('')

    const [show, setShow] = useState(false);
    
    const handleClose = () => 
    {
        setParamName('')
        setShow(false)
    }
    const handleShow = () => setShow(true);


    const [showAlertSuccess, setShowAlertSuccess] = useState(false);

    const alertCloseSuccess = () => setShowAlertSuccess(false);
    const alertShowSuccess = () => setShowAlertSuccess(true);

    useEffect(()=>{

        if(parameters.length!==0){
            let parameterHolder = [];
            for(let i=parameterHolder.length+1;i<parameters.length+1;i++){
                parameterHolder.push(<ParamCard desc={parameters[i-1]} parameter={parameters[i-1]} parameterNo={i} area={params.areaId} level={params.id} phase={params.phaseId} key={i}/>);
           }
            setParameterComps(parameterHolder);
        }else{
            fetch('http://localhost:1337/cictdrive/load-params',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    'level':params.id,
                    'phase':params.phaseId,
                    'area':params.areaId,
                })
            }).then(data => data.json())
            .then(data => {
                if(data.parameter.length!==0){
                console.log('loads',data.parameter)
                setParameters(data.parameter)
                }
          
            })
        }

    },[parameters])

    function createParam(){
        fetch('http://localhost:1337/cictdrive/create-param',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                'level':params.id,
                'phase':params.phaseId,
                'area':params.areaId,
                'parameter':parameters.length+1,
                'paramName':paramName,
                personName
            })
        }).then(data => data.json())
        .then(data => {
                handleClose()
                alertShowSuccess()
                setParameters([...parameters,data.parameter])
            
           
            
        })
    }

    return(
        <div className="h-100">

                    <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Parameter</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <form onSubmit={createParam}>
                            <div className='row justify-content-center mb-3'>
                                <div className='col-10'>
                                    <input type="text" className="form-control" placeholder='Ex. Paramater A' value={paramName} onChange={(e)=> setParamName(e.target.value)}/>  
                                </div>
                            </div>
                            <div className='row justify-content-center mb-3'>
                                <div className='col-10'>
                                    <button type="submit" className="form-control btn btn-dark">Create</button>
                                </div>
                            </div>     
                        </form>
                        </Modal.Body>
                    </Modal>



                    <Modal show={showAlertSuccess} onHide={alertCloseSuccess} centered>
                            <Modal.Header closeButton>
                            <Modal.Title>Success!</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>You successfully created a new Phase!</Modal.Body>
                            <Modal.Footer>
                            <Button variant="primary" onClick={alertCloseSuccess}>
                                Got it!
                            </Button>
                            </Modal.Footer>
                    </Modal>
                    <div className="row navbar-static-top">
                        <div className="col">
                            <Navigation />
                        </div>
                    </div>

                    <div className="row m-2">
                        <div className="col d-flex flex-column">

                            <div className="row border border-secondary" style={{ backgroundImage: `url(${bg6})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                <div className="col-8 col-sm-8 col-md-9">
                                    <div className='d-block d-sm-none'>
                                        <DropdownButton id="dropdown-item-button" variant='dark' title="">
                                            <Dropdown.Item href='/home'>Levels /</Dropdown.Item>
                                            <Dropdown.Item href={'/home/level/'+params.id}>Levels / Level{' '+params.id}</Dropdown.Item>
                                            <Dropdown.Item href={'/home/level/'+params.id+'/'+params.phaseId}>Levels / Level{' '+params.id} / Phase{' '+params.phaseId}</Dropdown.Item>
                                            <Dropdown.Item href={'/home/level/'+params.id+'/'+params.phaseId+'/'+params.areaId} className="bg-secondary text-light"><strong>Levels / Level{' '+params.id} / Phase{' '+params.phaseId} / Area{' '+params.areaId}</strong></Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                    <div className='d-none d-sm-block'>
                                        <a href='/home' className='btn text-decoration-underline text-secondary'><strong>Levels</strong></a> 
                                        <strong>-</strong>
                                        <a href={'/home/level/'+params.id} className='btn text-decoration-underline text-secondary'><strong>Level{' '+params.id}</strong></a> 
                                        <strong>-</strong>
                                        <a href={'/home/level/'+params.id+'/'+params.phaseId} className='btn text-decoration-underline text-secondary'><strong>Phase{' '+params.phaseId}</strong></a>
                                        <strong>-</strong>
                                        <a href={'/home/level/'+params.id+'/'+params.phaseId+'/'+params.areaId} className='btn text-decoration-underline text-dark'><strong>Area{' '+params.areaId}</strong></a> 
                                    </div>
                                </div>
                                {
                                    (userAreaURL === currentAreaURL || accountType==='admin') &&

                                    <div  onClick={handleShow} className='btn col-4 col-sm-4 col-md-3 d-xs-block d-sm-block d-md-block d-lg-none justify-content-left bg-dark text-light'>
                                    Create Parameter
                                </div>
                                }
                                
                            </div>


                            <div className="row border mt-1" style={{ height: '84vh'}}>

                                <div className="col-2 shadow d-none d-lg-block border border-secondary" style={{ backgroundImage: `url(${bg4})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                    <div className='row bg-dark text-light align-items-center' style={{ height: '7.5%'}}>
                                        <div className='col'>
                                            Area Paramaters
                                        </div>
                                    </div>

                                    <div className='row text-light justify-content-center p-2' style={{ height: '92.5%'}}>
                                        <div className='col-12'>
                                            {
                                                 (userAreaURL === currentAreaURL || accountType==='admin') &&
                                                 <button className='btn-dark form-control my-2' onClick={handleShow}>Create Parameter</button>
                                            }
                                            
                                        </div>
                                    </div>

                                </div>

                                <div className="col-12 col-lg-10">

                                    <div className="row p-3 overflow-auto" style={{ height: '80vh'}}>
                                        {parameterComps}
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
        </div>
    )
}


export default Area;