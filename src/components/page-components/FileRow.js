import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios'
import FileDownload from 'js-file-download'
import { DropdownButton, Modal,Card,Dropdown, Button } from 'react-bootstrap';
import bg1 from '../img/bg1.png'
import jwt_decode from 'jwt-decode'
function FileRow(props){
    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    const decodeToken = jwt_decode(accessToken)
    const personName = decodeToken.fName + ' ' + decodeToken.lName

    const [show, setShow] = useState(false);
    const [showRename, setShowRename] = useState(false);
    const[dir,setDir] = useState([]);
    const[renameFile,setRenameFile] = useState('')
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const[showDelConfirm,setDelConfirm] = useState('')
    const handleDelCloseConfirm = () =>setDelConfirm(false);
    const handleDelShowConfirm = () =>setDelConfirm(true);

    const handleCloseRename = () => 
    {
        setRenameFile('')
        setShowRename(false)
    }
    const handleShowRename = () => setShowRename(true);

    const params = useParams()

    const filenameArr = props.filename.split(".");
    useEffect(()=>{
        console.log(filenameArr[0])
        console.log(filenameArr[1])
        fetch('http://localhost:1337/cictdrive/load-dir',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                level:params.id,
                phase:params.phaseId,
                area: params.areaId
            })
        }).then(data=>data.json()).then(data=>{
            console.log("This will load areas",data.directions[0])
            console.log("This will load specific area containing its parameters",data.directions[0][params.areaId-1])
            let dirHolder = []
            for(let i = 0 ; i < data.directions[0][params.areaId-1].length;i++){
                if(i!==params.paramId-1){
                    dirHolder.push( <Dropdown.Item key={i} onClick={(e)=>{
                        fetch('http://localhost:1337/cictdrive/move-file',{
                            method:'POST',
                            headers:{
                                'Content-Type':'application/json'
                            },
                            body:JSON.stringify({
                                level:params.id,
                                phase:params.phaseId,
                                area: params.areaId,
                                oldParam: params.paramId,
                                newParam:i+1,
                                filename:props.filename,
                                fileId:props.fileId,
                                personName
                            })
                        }).then(data=>data.json()).then(data=>{
                            if(data.mess==="Success"){
                                window.location.href='/home/level/'+params.id+'/'+params.phaseId+'/'+params.areaId+'/'+data.newParam
                            }
                        })
                    }}>Move To {data.directions[0][params.areaId-1][i]}</Dropdown.Item>)
                   
                }
                 
            }
            setDir(dirHolder)
        })
    },[])

    function del(){
        fetch('http://localhost:1337/cictdrive/delete-file',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                'path':props.path,
                'filename':props.filename,
                'id':props.fileId,
                personName
            }),
        }).then(data=>data.json()).then(data=>
        {
           if(data.message==="ok"){
               handleDelCloseConfirm()
               window.location.href='/home/level/'+props.path
           } 
        })
    }

    function downloadFile(e){
        e.preventDefault()
        Axios({
            url:'http://localhost:1337/cictdrive/download-file',
            method:'POST',
            data:{
                'path':props.path,
                'filename':props.filename,
                personName
            },
            responseType:'blob'
        }).then((res)=>{
            
            FileDownload(res.data,props.filename)
        })
    }

    function rename(e) {
        e.preventDefault()
        console.log(filenameArr[0])
        console.log(renameFile)

        fetch('http://localhost:1337/cictdrive/rename-file',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                'fileId':props.fileId,
                'path':props.path,
                'newFilename': renameFile,
                'type': filenameArr[1],
                'oldFilename':  filenameArr[0],
                personName
            })

        }).then(data=>data.json()).then(data=>
            {
                if(data.mess==="Success"){
                    alert('File is Succesfully Renamed')
                    window.location.href='/home/level/'+props.path
                } 
             })
    }
    return(
            <div className="col-12 col-sm-6 col-md-4 col-xl-3">

            <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Move File To</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Dropdown>
                        <Dropdown.Toggle variant="dark" id="dropdown-basic">
                            Available Parameters
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {dir}
                        </Dropdown.Menu>
                    </Dropdown>
                </Modal.Body>
            </Modal>



            <Modal show={showRename} onHide={handleCloseRename} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{filenameArr[0]}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={rename}>
                    <div className='row justify-content-center mb-3'>
                        <div className='col-10'>
                            <input type="text" className="form-control" placeholder={filenameArr[0]} value={renameFile} onChange={(e)=> setRenameFile(e.target.value)}/>  
                        </div>
                    </div>
                    <div className='row justify-content-center mb-3'>
                        <div className='col-10'>
                            <button type="submit" className="form-control btn btn-dark">Rename</button>
                        </div>
                    </div>     
                </form>
                </Modal.Body>
            </Modal>

            <Modal show={showDelConfirm} onHide={handleDelCloseConfirm} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>File Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you really want to delete this file?
                </Modal.Body>
                <Modal.Footer>
                            <Button variant="secondary" onClick={handleDelCloseConfirm}>
                                No
                            </Button>
                            <Button variant="primary" onClick={del}>
                                Confirm
                            </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDelConfirm} onHide={handleDelCloseConfirm} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>File Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you really want to delete this file?
                </Modal.Body>
                <Modal.Footer>
                            <Button variant="secondary" onClick={handleDelCloseConfirm}>
                                No
                            </Button>
                            <Button variant="primary" onClick={del}>
                                Confirm
                            </Button>
                </Modal.Footer>
            </Modal>

            <Card
            text={'dark'}
            className="mb-2 shadow"
            >
                <Card.Header bg={'secondary'} className="bg-dark text-light">{props.filename}</Card.Header>
                <Card.Body style={{ backgroundImage: `url(${bg1})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                    <Card.Text className="m-4" style={{textShadow: '4px 4px 24px rgba(251,251,251,1)'}}>
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <div className='d-flex flex-row-reverse'>
                            <DropdownButton id="dropdown-basic-button" variant='dark' title='Action'>
                                <Dropdown.Item onClick={handleShowRename}>Rename</Dropdown.Item>
                                <Dropdown.Item onClick={handleDelShowConfirm}>Delete</Dropdown.Item>
                                <Dropdown.Item onClick={handleShow}>Move</Dropdown.Item>
                                <Dropdown.Item onClick={downloadFile}>Download</Dropdown.Item>
                            </DropdownButton>
                    </div>
                        
                </Card.Footer>
            </Card>

        </div>
    )
}

export default FileRow