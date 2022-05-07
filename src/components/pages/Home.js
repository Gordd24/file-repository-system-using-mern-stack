import Level from '../page-components/LevelCard'
import Navigation from '../page-components/Navigation'
import React,{useState,useEffect} from 'react';
import jwt_decode from 'jwt-decode'
import { Dropdown, DropdownButton } from 'react-bootstrap';
import bg4 from '../img/bg4.png'
import bg5 from '../img/bg5.png'
import bg6 from '../img/bg6.png'

function Home(){
    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    const decodeToken = jwt_decode(accessToken)
    const personName = decodeToken.fName + ' ' + decodeToken.lName
    
    const[levelComps,setLevelComps] = useState([])
    const[levels,setLevels] = useState([])
    useEffect(
        ()=>{

            if(levels.length!==0){
                let levelHolder = [];
                for(let i=levelHolder.length+1;i<levels.length+1;i++){
                     levelHolder.push(<Level desc={'All files relevant to level '+(i)+' were placed in this directory.'} level={i} levelId={levels[i-1]} key={levels[i-1]}/>);
                }
                setLevelComps(levelHolder);
            }else{
                fetch('http://localhost:1337/cictdrive/load-levels').then(data => data.json())
                .then(data => {
                    if(data.level.length!==0){
                    setLevels(data.level)
                    }
                })
            }
        }
    ,[levels])

    function createLevel() {
        fetch('http://localhost:1337/cictdrive/create-level',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                'level':levels.length+1,
                personName
            })
        }).then(data => data.json())
        .then(data => {
            if(data.level === "Maximum"){
                alert('Level creation has reached its maximum limit!')
            }else{
                setLevels([...levels,data.level])
                alert('Level '+(levels.length+1)+' was successfully created!')       
            }  
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

                            <div className="row border border-secondary" style={{ backgroundImage: `url(${bg6})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                
                                <div className="col-8 col-sm-8 col-md-9">
                                    <div className='d-block d-sm-none'>
                                        <DropdownButton id="dropdown-item-button" variant='dark' title="">
                                            <Dropdown.Item className="bg-secondary text-light" href='/home'>Levels /</Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                    <div className='d-none d-sm-block'>
                                        <a  className="btn text-decoration-underline text-dark" href='/home'><strong>Levels</strong></a>
                                    </div>
                                </div>
                                <div  onClick={createLevel} className='btn col-4 col-sm-4 col-md-3 d-xs-block d-sm-block d-md-block d-lg-none justify-content-left bg-dark text-light'>
                                    Create Level
                                </div>
                            </div>


                            <div className="row border mt-1 border" style={{ height: '84vh'}}>

                                <div className="col-2 shadow d-none d-lg-block border border-secondary"  style={{ backgroundImage: `url(${bg4})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                    <div className='row bg-dark text-light align-items-center' style={{ height: '7.5%'}}>
                                        <div className='col'>
                                            Accreditation Level
                                        </div>
                                    </div>

                                    <div className='row text-light justify-content-center p-2' style={{ height: '92.5%'}}>
                                        <div className='col-12'>
                                            <button className='btn-dark form-control my-2' onClick={createLevel}>Create Level</button>
                                        </div>
                                    </div>

                                </div>

                                {/* <div className="col-12 col-lg-10 "  style={{ backgroundImage: `url(${bg5})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}> */}
                                <div className="col-12 col-lg-10 ">
                                    {/* <div className="row justify-content-center p-3 overflow-auto" style={{ height: '78vh'}}> */}
                                    <div className="row overflow-auto p-3" style={{ height: '78vh'}}> 
                                     
                                            {levelComps}
                                      
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>


        </div>
    )
}
export default Home;