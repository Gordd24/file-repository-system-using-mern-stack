import logout from '../page-components/Logout';
import FileRow from '../page-components/FileRow';
import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';


function Parameter(props){

    const params = useParams()

    const [file, setFile] = useState('');
    //for displaying list of files
    const [files,setFiles] = useState([]);

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
                    let row = <FileRow path={fileData.directory} key={item+fileData.filename} filename={fileData.filename} filetype={fileData.type}/>
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
          dir: params.id+'/'+params.phaseId+'/'+params.areaId+'/'+params.paramId
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
             body:data,
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

                

                <div className="row navbar-static-top">

                    
                    <div className="col">
                        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                            <div className="container-fluid">
                                <a className="navbar-brand" href="/home">CICT Drive</a>

                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>

                                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                                    <div className="navbar-nav">
                                        <a className="nav-link active" href="/home">Home</a>
                                        <a className="nav-link" href="/registration">Registration</a>
                                        <a className="nav-link" href="#">Logs</a>
                                        <li className="nav-item dropdown">
                                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                My Account
                                            </a>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li><a className="dropdown-item" href="#">Update</a></li>
                                                <li><a className="dropdown-item" onClick={logout} href='#'>Sign Out</a></li>
                                            </ul>
                                        </li>
                                    </div>
                                </div>

                            </div>
                        </nav>   

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
                                    <a href={'/home/level/'+params.id+'/'+params.phaseId+'/'+params.areaId+'/'+params.paramId} className='mx-2'>Parameter{' '+params.paramId}</a> 
                                </div>
                            </div>


                            <div className="row border mt-1" style={{ height: '84vh'}}>

                                <div className="col-2 shadow d-none d-lg-block">
                                    <div className='row bg-dark text-light align-items-center' style={{ height: '7.5%'}}>
                                        <div className='col'>
                                            Paramater Files
                                        </div>
                                    </div>

                                    <div className='row text-light justify-content-center p-2' style={{ height: '92.5%'}}>
                                        <div className='col-12'>
                                            <button className='btn-dark form-control my-2'>Upload File</button>
                                            <input type="file" onChange={saveFile} multiple/>
                                            <button onClick={handleUpload}>Upload</button>
                                            
                                        </div>
                                    </div>

                                

                                </div>

                                <div className="col-12 col-lg-10">

                                    <div className="row shadow d-flex d-xs-block d-sm-block d-lg-none d-xl-none align-items-center" style={{ height: '8vh'}}>
                                        <div className="col-12">

                                            <div className="row justify-content-center">
                                                <div className="col-6 col-sm-4">
                                                    <button className='btn-dark form-control shadow'>Upload File</button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="row justify-content-center p-3 overflow-auto" style={{ height: '78vh'}}>
                                      
                                        <table className="table">
                                            <thead className="bg-dark text-light">
                                                <tr>
                                                    <th scope="col">Filename</th>
                                                    <th scope="col">Type</th>
                                                    <th scope="col"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {files}
                                            </tbody>
                                        </table>


                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>


        </div>
    )
}


export default Parameter;