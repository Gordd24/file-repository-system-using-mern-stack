import Navigation from '../page-components/Navigation'
import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import AreaCard from '../page-components/AreaCard'


function Phase(props){

    const params = useParams()
    const[areaComps,setAreaComps] = useState([])
    const description = []

    useEffect(
        ()=>{
                let areaHolder = [];
                for(let i=1;i<11;i++){
                     areaHolder.push(<AreaCard desc={description[i-1]} level={params.id} phase={params.phaseId} area={i} key={i}/>);
                }
                setAreaComps(areaHolder);

        }
    ,[])


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
                                </div>
                            </div>


                            <div className="row border mt-1" style={{ height: '84vh'}}>

                                <div className="col-2 shadow d-none d-lg-block">
                                    <div className='row bg-dark text-light align-items-center' style={{ height: '7.5%'}}>
                                        <div className='col'>
                                            Phase Areas
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
                                        {areaComps}

                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>


        </div>
    )
}


export default Phase;