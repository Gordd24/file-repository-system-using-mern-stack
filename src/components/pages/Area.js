import logout from '../page-components/Logout';
import ParamCard from '../page-components/ParamCard';
import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';


function Area(props){

    const params = useParams()
    const[parameterComps,setParameterComps] = useState([])
    const[parameters,setParameters] = useState([])

    useEffect(()=>{

        if(parameters.length!==0){
            let parameterHolder = [];
            for(let i=parameterHolder.length+1;i<parameters.length+1;i++){
                 parameterHolder.push(<ParamCard desc={'Parameter '+(i)} parameter={i} area={params.areaId} level={params.id} phase={params.phaseId} key={i}/>);
            }
            setParameterComps(parameterHolder);
        }else{
            fetch('http://localhost:1337/cictdrive/load-params',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    'level':params.id,
                    'phase':params.phaseId,
                    'area':params.areaId,
                })
            }).then(data => data.json())
            .then(data => {
                if(data.parameter.length!==0){
                console.log('loads',data.parameter)
                setParameters(data.parameter)
                }
          
            })
        }

    },[parameters])

    function createParam(){
        fetch('http://localhost:1337/cictdrive/create-param',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                'level':params.id,
                'phase':params.phaseId,
                'area':params.areaId,
                'parameter':parameters.length+1
            })
        }).then(data => data.json())
        .then(data => {

                console.log('create',data)
                setParameters([...parameters,data.parameter])
                console.log(data.parameter)
           
            
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
                                    directory
                                </div>
                            </div>


                            <div className="row border mt-1" style={{ height: '84vh'}}>

                                <div className="col-2 shadow d-none d-lg-block">
                                    <div className='row bg-dark text-light align-items-center' style={{ height: '7.5%'}}>
                                        <div className='col'>
                                            Area Paramaters
                                        </div>
                                    </div>

                                    <div className='row text-light justify-content-center p-2' style={{ height: '92.5%'}}>
                                        <div className='col-12'>
                                            <button className='btn-dark form-control my-2' onClick={createParam}>Create Parameter</button>
                                        </div>
                                    </div>

                                </div>

                                <div className="col-12 col-lg-10">

                                    <div className="row shadow d-flex d-xs-block d-sm-block d-lg-none d-xl-none align-items-center" style={{ height: '8vh'}}>
                                        <div className="col-12">

                                            <div className="row justify-content-center">
                                                <div className="col-6 col-sm-4">
                                                    <button className='btn-dark form-control shadow'>Create Phase</button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="row justify-content-center p-3 overflow-auto" style={{ height: '78vh'}}>
                                        {parameterComps}

                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>


        </div>
    )
}


export default Area;