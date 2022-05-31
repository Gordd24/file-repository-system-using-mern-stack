import React,{useState,useEffect} from 'react';
import Navigation from '../page-components/Navigation'
import "../css/style.css"
import bg9 from '../img/bg9.png'
import jwt_decode from 'jwt-decode'
import {Table,Modal,Button} from 'react-bootstrap'
import ArchiveRow from '../page-components/ArchiveRow'

function Archives(){
    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    const decodeToken = jwt_decode(accessToken)
    const type = decodeToken.type

    const[archives,setArchives] = useState([])
    useEffect(()=>{
        fetch('http://localhost:1337/cictdrive/load-archives/').then(data=>data.json()).then(data=>{
            let archiveComponents = []

            archiveComponents = data.archives.map((archive,index)=>{
               return <ArchiveRow filename={archive.filename} id={archive._id} path={archive.directory} assignmentPath={archive.directory.slice(0,5)} key={index}/>
            })
            
            setArchives(archiveComponents)
        })
    })

    function retAll(){
        fetch('http://localhost:1337/cictdrive/ret-all/').then(data=>data.json()).then(data=>{
            window.location.reload()
        })
    }
    function delAll(){
        fetch('http://localhost:1337/cictdrive/del-all/').then(data=>data.json()).then(data=>{
            window.location.reload()
        })
    }
    
    const [showDelAll, setDelAllShow] = useState(false);
    const handleDelAllClose = () => setDelAllShow(false);
    const handleDelAllShow = () => setDelAllShow(true);

    const [showRetAll, setRetAllShow] = useState(false);
    const handleRetAllClose = () => setRetAllShow(false);
    const handleRetAllAShow = () => setRetAllShow(true);

    return(
        <div className="h-100">   
                    <Modal show={showDelAll} onHide={handleDelAllClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Files Deletion</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Once you click the confirm button you are permanently removing all the files.</Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleDelAllClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={delAll}>
                            Confirm
                        </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showRetAll} onHide={handleRetAllClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Retrieve All Files</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>By clicking the confirm button, all the files will be retrieve.</Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleRetAllClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={retAll}>
                            Confirm
                        </Button>
                        </Modal.Footer>
                    </Modal>
                    <div className="row navbar-static-top">
                        <div className="col">
                            <Navigation />
                        </div>
                    </div>


                    <div className='row m-2 shadow-lg' style={{height: '90%'}}>

                        <div className='col-md-9 col-sm-12'>

                            <div className='row align-items-center bg-dark text-light' style={{height: '9%'}}>
                                <div className='col text-start'>
                                    <h4>Archives</h4>
                                </div>
                                <div className='col text-end'>
                                        {(
                                            ()=>{
                                                if(type==='admin'){
                                                    return(
                                                            <>
                                                            <button className='mx-2 btn btn-primary' onClick={handleRetAllAShow}>Retrieve All</button>
                                                            <button className='mx-2 btn btn-danger'  onClick={handleDelAllShow}>Delete All</button>
                                                            </>
                                                    )
                                                }
                                            }
                                        )()}
                                </div>
                            </div>


                            <div className='row' style={{height: '91%'}}>
                                <div className='col p-2 '>

                                    <div className='row overflow-auto' style={{height: '80vh'}}>
                                        <div className='col'>                                        
                                            <Table striped bordered hover variant="dark">
                                                <thead>
                                                    <tr>
                                                        <th>Filename</th>
                                                        <th className='text-center'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {archives}                                         
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div className='col-md-3 col-sm-12 d-none d-md-block bg-dark' style={{ backgroundImage: `url(${bg9})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                            <div className='row justify-content-right'>
                                <div className='col p-5 mt-5'>
                                    <h1 className='text-light'>
                                        All removed files are here.
                                    </h1>
                                </div>
                            </div>
                        </div>

                        

                       

                    </div>


        </div>
    )
}


export default Archives;