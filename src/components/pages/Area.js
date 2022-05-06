import Navigation from '../page-components/Navigation'
import ParamCard from '../page-components/ParamCard';
import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode'
import { Modal } from 'react-bootstrap';

function Area(props){

    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    const decodeToken = jwt_decode(accessToken)
    const personName = decodeToken.fName + ' ' + decodeToken.lName

    const params = useParams()
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

                console.log('create',data)
                setParameters([...parameters,data.parameter])
                console.log(data.parameter)
           
            
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
                    <div className="row navbar-static-top">
                        <div className="col">
                            <Navigation />
                        </div>
                    </div>

                    <div className="row m-2">
                        <div className="col d-flex flex-column">

                            <div className="row border p-1">
                                <div className="col p-1">
                                    <a href='/home' className='mx-2'>Levels</a> 
                                    <a href={'/home/level/'+params.id} className='mx-2'>Level{' '+params.id}</a> 
                                    <a href={'/home/level/'+params.id+'/'+params.phaseId} className='mx-2'>Phase{' '+params.phaseId}</a> 
                                    <a href={'/home/level/'+params.id+'/'+params.phaseId+'/'+params.areaId} className='mx-2'>Area{' '+params.areaId}</a> 
                                </div>
                            </div>


                            <div className="row border mt-1" style={{ height: '84vh'}}>

                                <div className="col-2 shadow d-none d-lg-block">
                                    <div className='row bg-dark text-light align-items-center' style={{ height: '7.5%'}}>
                                        <div className='col'>
                                            Area Paramaters
                                        </div>
                                    </div>

                                    <div className='row text-light justify-content-center p-2' style={{ height: '92.5%'}}>
                                        <div className='col-12'>
                                        <button className='btn-dark form-control my-2' onClick={handleShow}>Create Parameter</button>
                                        </div>
                                    </div>

                                </div>

                                <div className="col-12 col-lg-10">

                                    <div className="row shadow d-flex d-xs-block d-sm-block d-lg-none d-xl-none align-items-center" style={{ height: '8vh'}}>
                                        <div className="col-12">

                                            <div className="row justify-content-center">
                                                <div className="col-6 col-sm-4">
                                                    <button className='btn-dark form-control shadow'>Create Phase</button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="row justify-content-center p-3 overflow-auto" style={{ height: '78vh'}}>
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