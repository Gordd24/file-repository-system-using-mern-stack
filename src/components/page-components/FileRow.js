import axios from 'axios'
import Axios from 'axios'
import FileDownload from 'js-file-download'
function FileRow(props){

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
        console.log(props.path)
    }
    function download(){
        fetch('http://localhost:1337/cictdrive/download-file',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                'path':props.path,
                'filename':props.filename
            }),
        })
        .then(data=> {
            console.log(data)
            FileDownload(data.data,props.filename) 
            console.log('hehe')})
       
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
            <th scope="row">{props.filename}</th>
            <td>{props.filetype}</td>
            <td>
                <button onClick={view}> View </button>
                <button onClick={del}> Delete </button>
                <button onClick={move}> Move </button>
                <button onClick={downloadFile}> Download </button>
            </td>
        </tr>
    )
}

export default FileRow