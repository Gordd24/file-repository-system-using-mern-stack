import PhaseCard from '../page-components/PhaseCard';
import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../page-components/Navigation'
import { Dropdown, DropdownButton, Modal, Button } from 'react-bootstrap';
import bg4 from '../img/bg4.png'
import jwt_decode from 'jwt-decode'
import bg6 from '../img/bg6.png'


function Level(props){
    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    const decodeToken = jwt_decode(accessToken)
    const personName = decodeToken.fName + ' ' + decodeToken.lName
    const accountType = decodeToken.type

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);

    const alertCloseSuccess = () => setShowAlertSuccess(false);
    const alertShowSuccess = () => setShowAlertSuccess(true);

    const params = useParams()

    const[phaseComps,setPhaseComps] = useState([])

    useEffect(
        ()=>{
                fetch('http://localhost:1337/cictdrive/load-phases',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        'level':params.id,
                    })
                })
                .then(data => data.json())
                .then(data => {
                    console.log(data.phases)
                    const phaseHolder = data.phases.map((phase)=><PhaseCard desc={'Phase '+(phase)} level={params.id} phase={phase} key={phase}/>)
                    setPhaseComps(phaseHolder);
                })
            }
        
    ,[])


    function createPhase() {
        console.log('hehe')
        fetch('http://localhost:1337/cictdrive/create-phase',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                'level':params.id,
                'phase':phaseComps.length+1,
                personName
            })
        }).then(data => data.json())
        .then(data => {
            handleClose()
            setPhaseComps([...phaseComps,<PhaseCard desc={'Phase '+(data.phase)} level={params.id} phase={data.phase} key={data.phase}/>])
            alertShowSuccess()
        })
    }

    return(
        <div className="h-100">
                    <Modal show={show} onHide={handleClose} centered>
                            <Modal.Header closeButton>
                            <Modal.Title>Create Phase</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>By clicking the confirm button you are creating a new Phase, Do you want to continue?</Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                No
                            </Button>
                            <Button variant="primary" onClick={createPhase}>
                                Confirm
                            </Button>
                            </Modal.Footer>
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
                            <Navigation/>
                        </div>
                    </div>

                    <div className="row m-2">
                        <div className="col d-flex flex-column">

                            <div className="row border border-secondary" style={{ backgroundImage: `url(${bg6})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                <div className="col-8 col-sm-8 col-md-9">
                                    <div className='d-block d-sm-none'>
                                        <DropdownButton id="dropdown-item-button" variant='dark' title="">
                                            <Dropdown.Item href='/home'>Levels /</Dropdown.Item>
                                            <Dropdown.Item className="bg-secondary text-light" href={'/home/level/'+params.id}><strong>Levels / Level{' '+params.id}</strong></Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                    <div className='d-none d-sm-block'>
                                        <a href='/home' className='btn text-decoration-underline text-secondary'><strong>Levels</strong></a> 
                                        <strong>-</strong>
                                        <a href={'/home/level/'+params.id} className='btn text-decoration-underline text-dark'><strong>Level{' '+params.id}</strong></a> 
                                    </div>
                                </div>
                                {
                                    accountType === 'admin' && 
                                    <div  onClick={handleShow} className='btn col-4 col-sm-4 col-md-3 d-xs-block d-sm-block d-md-block d-lg-none justify-content-left bg-dark text-light'>
                                    Create Phase
                                    </div>
                                }
                                
                            </div>


                            <div className="row border mt-1" style={{ height: '84vh'}}>

                                <div className="col-2 shadow d-none d-lg-block border border-secondary" style={{ backgroundImage: `url(${bg4})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                    <div className='row bg-dark text-light align-items-center' style={{ height: '7.5%'}}>
                                        <div className='col'>
                                            Level Phases
                                        </div>
                                    </div>

                                    <div className='row text-light justify-content-center p-2' style={{ height: '92.5%'}}>
                                        <div className='col-12'>
                                            {
                                                accountType === 'admin' &&
                                                <button className='btn-dark form-control my-2' onClick={handleShow}>Create Phase</button>
                                            }
                                            
                                        </div>
                                    </div>

                                </div>

                                <div className="col-12 col-lg-10">

                                    <div className="row p-3 overflow-auto" style={{ height: '80vh'}}>
                                        {phaseComps}

                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>


        </div>
    )
}


export default Level;