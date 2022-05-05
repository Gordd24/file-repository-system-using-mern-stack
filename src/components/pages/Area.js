import Navigation from '../page-components/Navigation'
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
                            <Navigation />
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