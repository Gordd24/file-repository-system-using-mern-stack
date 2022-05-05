import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios'
import FileDownload from 'js-file-download'
import { Modal,Button,ButtonGroup,Dropdown } from 'react-bootstrap';
function FileRow(props){

    const [show, setShow] = useState(false);
    const[dir,setDir] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const params = useParams()

    useEffect(()=>{
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
                if(i!=params.paramId-1){
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
                                fileId:props.fileId
                            })
                        }).then(data=>data.json()).then(data=>{
                            if(data.mess=="Success"){
                                window.location.href='/home/level/'+params.id+'/'+params.phaseId+'/'+params.areaId+'/'+data.newParam
                            }
                        })
                    }}>Move To {data.directions[0][params.areaId-1][i]}</Dropdown.Item>)
                   
                }
                 
            }
            setDir(dirHolder)
        })
    },[])

    function view(){
        console.log(props.path)
    }
    function del(){
        fetch('http://localhost:1337/cictdrive/delete-file',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                'path':props.path,
                'filename':props.filename
            }),
        }).then(data=>data.json()).then(data=>
        {
           if(data.message=="ok"){
               alert('File is Succesfully deleted')
               window.location.href='/home/level/'+props.path
           } 
        })
    }
    function move(){
        window.location.href='/move/'+props.levelId+'/'+props.phaseId+'/'+props.areaId+'/'+props.paramId
    }

    function downloadFile(e){
        e.preventDefault()
        Axios({
            url:'http://localhost:1337/cictdrive/download-file',
            method:'POST',
            data:{
                'path':props.path,
                'filename':props.filename
            },
            responseType:'blob'
        }).then((res)=>{
            
            FileDownload(res.data,props.filename)
        })
    }
    return(
        <tr>
                    
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
            <th scope="row">{props.filename}</th>
            <td>{props.filetype}</td>
            <td>
                <ButtonGroup aria-label="First group">
                    <Button variant="outline-dark" onClick={view}>View</Button>
                    <Button variant="outline-dark" onClick={del}>Delete</Button>
                    <Button variant="outline-dark" onClick={handleShow}>Move</Button>
                    <Button variant="outline-dark" onClick={downloadFile}>Download</Button>
                </ButtonGroup>
            </td>
        </tr>
    )
}

export default FileRow