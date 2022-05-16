import Navigation from '../page-components/Navigation'
import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import AreaCard from '../page-components/AreaCard'
import { Dropdown, DropdownButton } from 'react-bootstrap';
import bg4 from '../img/bg4.png'
import bg5 from '../img/bg5.png'
import bg6 from '../img/bg6.png'

function Phase(props){

    const params = useParams()
    const[areaComps,setAreaComps] = useState([])
    const description = ['Mission, Vision, Goals & Objectives','Faculty','Curriculum and Intruction','Students','Research','Extension','Library','Physical Facilities','Laboratories','Administration']

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

                            <div className="row border border-secondary" style={{ backgroundImage: `url(${bg6})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                <div className="col-8 col-sm-8 col-md-9">
                                    <div className='d-block d-sm-none'>
                                        <DropdownButton id="dropdown-item-button" variant='dark' title="">
                                            <Dropdown.Item href='/home'>Levels /</Dropdown.Item>
                                            <Dropdown.Item href={'/home/level/'+params.id}>Levels / Level{' '+params.id}</Dropdown.Item>
                                            <Dropdown.Item href={'/home/level/'+params.id+'/'+params.phaseId} className="bg-secondary text-light"><strong>Levels / Level{' '+params.id} / Phase{' '+params.phaseId}</strong>/</Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                    <div className='d-none d-sm-block'>
                                        <a href='/home' className='btn text-decoration-underline text-secondary'><strong>Levels</strong></a> 
                                        <strong>-</strong>
                                        <a href={'/home/level/'+params.id} className='btn text-decoration-underline text-secondary'><strong>Level{' '+params.id}</strong></a> 
                                        <strong>-</strong>
                                        <a href={'/home/level/'+params.id+'/'+params.phaseId} className='btn text-decoration-underline text-dark'><strong>Phase{' '+params.phaseId}</strong></a> 
                                    </div>
                                </div>

                            </div>


                            <div className="row border mt-1" style={{ height: '84vh'}}>

                                <div className="col-2 shadow d-none d-lg-block border border-secondary" style={{ backgroundImage: `url(${bg4})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                    <div className='row bg-dark text-light align-items-center' style={{ height: '7.5%'}}>
                                        <div className='col'>
                                            Phase Areas
                                        </div>
                                    </div>

                                </div>

                                <div className="col-12 col-lg-10">

                                    <div className="row p-3 overflow-auto" style={{ height: '80vh'}}>
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