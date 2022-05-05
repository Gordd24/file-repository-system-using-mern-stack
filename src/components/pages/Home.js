import Level from '../page-components/LevelCard'
import Navigation from '../page-components/Navigation'
import React,{useState,useEffect} from 'react';
import jwt_decode from 'jwt-decode'


function Home(){
    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    //decode the access token
    const decodeToken = jwt_decode(accessToken)
    console.log(decodeToken.type)
    
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
                'level':levels.length+1
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

                            <div className="row border p-1">
                                <div className="col p-1">
                                    <a href='/home'>Levels</a> 
                                </div>
                            </div>


                            <div className="row border mt-1" style={{ height: '84vh'}}>

                                <div className="col-2 shadow d-none d-lg-block">
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

                                <div className="col-12 col-lg-10">

                                    <div className="row shadow d-flex d-xs-block d-sm-block d-lg-none d-xl-none align-items-center" style={{ height: '8vh'}}>
                                        <div className="col-12">

                                            <div className="row justify-content-center">
                                                <div className="col-6 col-sm-4">
                                                    <button className='btn-dark form-control shadow'>Create Level</button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="row justify-content-center p-3 overflow-auto" style={{ height: '78vh'}}>
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