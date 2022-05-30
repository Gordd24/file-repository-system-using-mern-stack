import Navigation from '../page-components/Navigation'
import FileRow from '../page-components/FileRow';
import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Modal,Dropdown,DropdownButton,Button } from 'react-bootstrap';
import bg4 from '../img/bg4.png'
import bg6 from '../img/bg6.png'
import jwt_decode from 'jwt-decode'

function Parameter(props){
    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    const decodeToken = jwt_decode(accessToken)
    const personName = decodeToken.fName + ' ' + decodeToken.lName
    const params = useParams()
    const currentAreaURL = params.id+'/'+params.phaseId+'/'+params.areaId
    const userAreaURL = decodeToken.level+'/'+ decodeToken.phase+'/'+ decodeToken.area
    
    const accountType = decodeToken.type
   
    const [file, setFile] = useState('');
    //for displaying list of files
    const [files,setFiles] = useState([]);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);

    const [showAlertSuccess, setShowAlertSuccess] = useState(false);

    const alertCloseSuccess = () => 
    {
        setShowAlertSuccess(false);
        window.location.href= '/home/level/'+params.id+'/'+params.phaseId+'/'+params.areaId+'/'+params.paramId
    }
    const alertShowSuccess = () => setShowAlertSuccess(true);

    useEffect(
        ()=>{

            fetch('http://localhost:1337/cictdrive/load-files',
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    'dir':params.id+'/'+params.phaseId+'/'+params.areaId+'/'+params.paramId
            })
            }).then(data => data.json())
            .then(data => {

                let rows = []
                for (const item in data) {
                    
                    let fileData = data[item]
                    let row = <FileRow path={fileData.directory} fileId={fileData.id} paramId={params.paramId} areaId={params.areaId} phaseId={params.phaseId} levelId={params.id} key={item+fileData.filename} filename={fileData.filename} filetype={fileData.type}/>
                    rows.push(row)
                }
                
                
                setFiles(rows)
            })

            
        }
    ,[])

    const saveFile = (e) => {
    setFile(e.target.files);
    };

    const handleUpload = (event) => {
        event.preventDefault();
        console.log(file);
        const obj = {
          dir: params.id+'/'+params.phaseId+'/'+params.areaId+'/'+params.paramId,
          levelDir:params.id,
          phaseDir:params.phaseId,
          areaDir:params.areaId,
          personName

        };

        const json = JSON.stringify(obj);
        const blob = new Blob([json], {
          type: 'application/json'
        });


        const data = new FormData();
        for (var x = 0; x < file.length; x++) {
            data.append("files", file[x]);
          }
        data.append('document',blob);
        fetch("http://localhost:1337/cictdrive/upload-file", {
             method: 'POST',
             body:data
        }).then(data => data.json()).then(data => {
            window.location.href= '/home/level/'+params.id+'/'+params.phaseId+'/'+params.areaId+'/'+params.paramId

            //for proper rerender
            // let newFiles=[]
            // for(let i = 0; i < data.length; i++){
            //     console.log('data'+i,data[i])
            //     newFiles.push(<tr key={i+data[i].filename}>
            //                         <th scope="row">{data[i].filename}</th>
            //                         <td>{data[i].type}</td>
            //                         <td>action</td>
            //                     </tr>)
            // }
            // console.log('array',newFiles)
            // setFiles(files.concat(newFiles))
        })


        

      }


    return(
        <div className="h-100">
                  <Modal show={showAlertSuccess} onHide={alertCloseSuccess} centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Your upload is done!</Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary" onClick={alertCloseSuccess}>
                        Got it!
                    </Button>
                    </Modal.Footer>
                </Modal>  
                 <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload File</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='row justify-content-center mb-3'>
                            <div className='col-10'>
                                <input className="form-control" type="file" onChange={saveFile} multiple></input>
                            </div>
                        </div>

                        <div className='row justify-content-center mb-3'>
                            <div className='col-10'>
                                <button className='btn btn-dark form-control' onClick={handleUpload}>Upload</button>
                            </div>
                        </div>
                       
                    </Modal.Body>
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
                                    <div className='d-block d-md-none'>
                                        <DropdownButton variant='dark' title="">
                                            <Dropdown.Item href='/home'>Levels /</Dropdown.Item>
                                            <Dropdown.Item href={'/home/level/'+params.id}>Levels / Level{' '+params.id}</Dropdown.Item>
                                            <Dropdown.Item href={'/home/level/'+params.id+'/'+params.phaseId}>Levels / Level{' '+params.id} / Phase{' '+params.phaseId}</Dropdown.Item>
                                            <Dropdown.Item href={'/home/level/'+params.id+'/'+params.phaseId+'/'+params.areaId}>Levels / Level{' '+params.id} / Phase{' '+params.phaseId} / Area{' '+params.areaId}</Dropdown.Item>
                                            <Dropdown.Item href={'/home/level/'+params.id+'/'+params.phaseId+'/'+params.areaId+'/'+params.paramId}  className="bg-secondary text-light"><strong>Levels / Level{' '+params.id} / Phase{' '+params.phaseId} / Area{' '+params.areaId} / Parameter{' '+params.paramId}</strong></Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                    <div className='d-none d-md-block'>
                                        <a href='/home' className='btn text-decoration-underline text-secondary'><strong>Levels</strong></a> 
                                        <strong>-</strong>
                                        <a href={'/home/level/'+params.id} className='btn text-decoration-underline text-secondary'><strong>Level{' '+params.id}</strong></a> 
                                        <strong>-</strong>
                                        <a href={'/home/level/'+params.id+'/'+params.phaseId} className='btn text-decoration-underline text-secondary'><strong>Phase{' '+params.phaseId}</strong></a>
                                        <strong>-</strong>
                                        <a href={'/home/level/'+params.id+'/'+params.phaseId+'/'+params.areaId} className='btn text-decoration-underline text-secondary'><strong>Area{' '+params.areaId}</strong></a> 
                                        <strong>-</strong>
                                        <a href={'/home/level/'+params.id+'/'+params.phaseId+'/'+params.areaId+'/'+params.paramId} className='btn text-decoration-underline text-dark'><strong>Parameter{' '+params.paramId}</strong></a> 
                                    </div>
                                </div>
                                {
                                    (userAreaURL === currentAreaURL || accountType==='admin') && 
                                    <div  onClick={handleShow} className='btn col-4 col-sm-4 col-md-3 d-xs-block d-sm-block d-md-block d-lg-none justify-content-left bg-dark text-light'>
                                        Upload File
                                    </div>
                                }
                                
                
                            </div>


                            <div className="row border mt-1" style={{ height: '84vh'}}>

                                <div className="col-2 shadow d-none d-lg-block border border-secondary" style={{ backgroundImage: `url(${bg4})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                    <div className='row bg-dark text-light align-items-center' style={{ height: '7.5%'}}>
                                        <div className='col'>
                                            Paramater Files
                                        </div>
                                    </div>

                                    <div className='row text-light justify-content-center p-2' style={{ height: '92.5%'}}>
                                        <div className='col-12'>
                                            {
                                                (userAreaURL === currentAreaURL || accountType==='admin') && 
                                                <button className='btn-dark form-control my-2' onClick={handleShow}>Upload File</button>

                                            }
                                            
                                            
                                        </div>
                                    </div>

                                </div>

                                <div className="col-12 col-lg-10">
                                        <div className="row p-3 overflow-auto" style={{ height: '80vh'}}>
                                            {files}
                                        </div>
                                </div>
                            </div>

                        </div>
                    </div>


        </div>
    )
}


export default Parameter;