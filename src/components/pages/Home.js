import Level from '../page-components/LevelCard'
import Navigation from '../page-components/Navigation'
import React,{useState,useEffect} from 'react';
import jwt_decode from 'jwt-decode'
import { Dropdown, DropdownButton, Modal, Button } from 'react-bootstrap';
import bg4 from '../img/bg4.png'
import bg5 from '../img/bg5.png'
import bg6 from '../img/bg6.png'

function Home(){
    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    const decodeToken = jwt_decode(accessToken)
    const personName = decodeToken.fName + ' ' + decodeToken.lName


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);

    const alertCloseSuccess = () => setShowAlertSuccess(false);
    const alertShowSuccess = () => setShowAlertSuccess(true);

    const [showAlertFailed, setShowAlertFailed] = useState(false);

    const alertCloseFailed = () => setShowAlertFailed(false);
    const alertShowFailed = () => setShowAlertFailed(true);


    
    const[levelComps,setLevelComps] = useState([])


    useEffect(
        ()=>{
            fetch('http://localhost:1337/cictdrive/load-levels').then(data => data.json())
            .then(data => {

                const levelsHolder = data.data.map((level,index)=><Level desc={'All files relevant to level '+(index+1)+' were placed in this directory.'} level={index+1} levelId={level._id} key={level._id}/>)
                setLevelComps(levelsHolder)
            })
        }
    ,[])


    function createLevel() {
        fetch('http://localhost:1337/cictdrive/create-level',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                'level':levelComps.length+1,
                personName
            })
        })
        .then(data => data.json())
        .then(data => {
            if(data.level === "Maximum"){
               handleClose()
                alertShowFailed()
            }else{
                setLevelComps([...levelComps,<Level desc={'All files relevant to level '+(data.doc.value)+' were placed in this directory.'} level={data.doc.value} levelId={data.doc._id} key={data.doc._id}/>])
                handleClose()
                alertShowSuccess()  
            }  
        })
    }


    return(
        <div className="h-100">

                    <Modal show={show} onHide={handleClose} centered>
                            <Modal.Header closeButton>
                            <Modal.Title>Create Level</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>By clicking the confirm button you are creating a new level, Do you want to continue?</Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                No
                            </Button>
                            <Button variant="primary" onClick={createLevel}>
                                Confirm
                            </Button>
                            </Modal.Footer>
                    </Modal>

                    <Modal show={showAlertSuccess} onHide={alertCloseSuccess} centered>
                            <Modal.Header closeButton>
                            <Modal.Title>Success!</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>You successfully created a new Level!</Modal.Body>
                            <Modal.Footer>
                            <Button variant="primary" onClick={alertCloseSuccess}>
                                Got it!
                            </Button>
                            </Modal.Footer>
                    </Modal>


                    <Modal show={showAlertFailed} onHide={alertCloseFailed} centered>
                            <Modal.Header closeButton>
                            <Modal.Title>Creation Failed!</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>It seems like you've reached the maximum number of available levels.</Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={alertCloseFailed}>
                                Understood
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
                                            <Dropdown.Item className="bg-secondary text-light" href='/home'>Levels /</Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                    <div className='d-none d-sm-block'>
                                        <a  className="btn text-decoration-underline text-dark" href='/home'><strong>Levels</strong></a>
                                    </div>
                                </div>
                                <div  onClick={handleShow} className='btn col-4 col-sm-4 col-md-3 d-xs-block d-sm-block d-md-block d-lg-none justify-content-left bg-dark text-light'>
                                    Create Level
                                </div>
                            </div>


                            <div className="row border mt-1 border" style={{ height: '84vh'}}>

                                <div className="col-2 shadow d-none d-lg-block border border-secondary"  style={{ backgroundImage: `url(${bg4})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                    <div className='row bg-dark text-light align-items-center' style={{ height: '7.5%'}}>
                                        <div className='col'>
                                            Accreditation Level
                                        </div>
                                    </div>

                                    <div className='row text-light justify-content-center p-2' style={{ height: '92.5%'}}>
                                        <div className='col-12'>
                                            <button className='btn-dark form-control my-2' onClick={handleShow}>Create Level</button>
                                        </div>
                                    </div>

                                </div>

                                {/* <div className="col-12 col-lg-10 "  style={{ backgroundImage: `url(${bg5})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}> */}
                                <div className="col-12 col-lg-10 ">
                                    {/* <div className="row justify-content-center p-3 overflow-auto" style={{ height: '78vh'}}> */}
                                    <div className="row overflow-auto p-3" style={{ height: '78vh'}}> 
                                     
                                            {levelComps}
                                      
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>


        </div>
    )
}
export default Home;