import React,{useState,useEffect} from 'react';
import Navigation from '../page-components/Navigation'
import "../css/style.css"
import bg9 from '../img/bg9.png'
import jwt_decode from 'jwt-decode'
import {Table} from 'react-bootstrap'
import ArchiveRow from '../page-components/ArchiveRow'

function Archives(){

    const[archives,setArchives] = useState([])
    useEffect(()=>{
        fetch('http://localhost:1337/cictdrive/load-archives/').then(data=>data.json()).then(data=>{
            let archiveComponents = []

            archiveComponents = data.archives.map((archive,index)=>{
               return <ArchiveRow filename={archive.filename} id={archive._id} path={archive.directory} key={index}/>
            })
            
            setArchives(archiveComponents)
        })
    })

    


    return(
        <div className="h-100">   
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