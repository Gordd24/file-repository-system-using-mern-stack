import jwt_decode from "jwt-decode"
import React,{useState,useEffect} from 'react';
import {Modal,Button} from 'react-bootstrap'
function ArchiveRow(props){
    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    const decodeToken = jwt_decode(accessToken)
    const personName = decodeToken.fName + ' ' + decodeToken.lName


    const [showDelConf, setShowDelConf] = useState(false);

    const handleCloseDelConf = () => setShowDelConf(false);
    const handleShowDelConf = () => setShowDelConf(true);

    const [showRetConf, setShowRetConf] = useState(false);

    const handleCloseRetConf = () => setShowRetConf(false);
    const handleShowRetConf = () => setShowRetConf(true);

    function del(){

        fetch('http://localhost:1337/cictdrive/perma-delete-file',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                'path':props.path,
                'filename':props.filename,
                'id':props.id,
                personName
            }),
        }).then(data=>data.json()).then(data=>
        {
        if(data.message==="ok"){
            handleCloseDelConf()
            window.location.reload()
        } 
        })


    }

    function ret(){
        fetch('http://localhost:1337/cictdrive/ret-file/'+props.id).then(data=>data.json()).then(data=>
        {
            if(data.message==="ok"){
                handleCloseRetConf()
                window.location.reload()
            } 
        })
    }

    return(
        <tr>
             <Modal show={showDelConf} onHide={handleCloseDelConf}>
                <Modal.Header closeButton>
                <Modal.Title>File Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>By confirming you are permanently removing the file.</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDelConf}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={del}>
                    Confirm
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showRetConf} onHide={handleCloseRetConf}>
                <Modal.Header closeButton>
                <Modal.Title>File Retrieval</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you want to retrieve this file?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseRetConf}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={ret}>
                    Confirm
                </Button>
                </Modal.Footer>
            </Modal>

            <td>{props.filename}</td>
            <td className='text-center'>
                <button className='mx-2 btn btn-primary' onClick={handleShowRetConf}>Retrieve</button>
                <button className='mx-2 btn btn-danger' onClick={handleShowDelConf}>Delete</button>
            </td>
        </tr>  
    )
}

export default ArchiveRow