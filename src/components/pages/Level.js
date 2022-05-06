import PhaseCard from '../page-components/PhaseCard';
import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../page-components/Navigation'
import jwt_decode from 'jwt-decode'

function Level(props){
    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    const decodeToken = jwt_decode(accessToken)
    const personName = decodeToken.fName + ' ' + decodeToken.lName

    const params = useParams()

    const[phaseComps,setPhaseComps] = useState([])
    const[phases,setPhases] = useState([])
    useEffect(()=>{
        console.log('eyo');
        console.log(params.id)
        console.log(phases)
        setPhases([]);

    },[])


    useEffect(
        ()=>{
            // console.log('phases:',phases);
            // console.log('phases length:',phases.length);
            if(phases.length!==0){
                let phaseHolder = [];
                for(let i=phaseHolder.length+1;i<phases.length+1;i++){
                     phaseHolder.push(<PhaseCard desc={'Phase '+(i)} level={params.id} phase={i} key={phases[i-1]}/>);
                }
                setPhaseComps(phaseHolder);
            }else{
                fetch('http://localhost:1337/cictdrive/load-phases',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        'level':params.id,
                    })
                }).then(data => data.json())
                .then(data => {
                    if(data.phases.length!==0){
                        console.log(data.phases)
                        console.log('got in');
                        setPhases(data.phases)
                    }
                })
            }
        }
    ,[phases])

    function createPhase() {

        fetch('http://localhost:1337/cictdrive/create-phase',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                'level':params.id,
                'phase':phases.length+1,personName
            })
        }).then(data => data.json())
        .then(data => {
            setPhases([...phases,data.phase])
        })
    }

    return(
        <div className="h-100">
                    <div className="row navbar-static-top">
                        <div className="col">
                            <Navigation/>
                        </div>
                    </div>

                    <div className="row m-2">
                        <div className="col d-flex flex-column">

                            <div className="row border p-1">
                                <div className="col p-1">
                                    <a href='/home' className='mx-2'>Levels</a> 
                                    <a href={'/home/level/'+params.id} className='mx-2'>Level{' '+params.id}</a> 
                                </div>
                            </div>


                            <div className="row border mt-1" style={{ height: '84vh'}}>

                                <div className="col-2 shadow d-none d-lg-block">
                                    <div className='row bg-dark text-light align-items-center' style={{ height: '7.5%'}}>
                                        <div className='col'>
                                            Level Phases
                                        </div>
                                    </div>

                                    <div className='row text-light justify-content-center p-2' style={{ height: '92.5%'}}>
                                        <div className='col-12'>
                                            <button className='btn-dark form-control my-2' onClick={createPhase}>Create Phase</button>
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
                                        {phaseComps}

                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>


        </div>
    )
}


export default Level;