import { Card } from 'react-bootstrap';
import bg1 from '../img/bg1.png'
function AreaCard(props){

    function viewArea(){
        window.location.href='/home/level/'+props.level+'/'+props.phase+'/'+props.area
    }
    
    return(

                <div className="col-12 col-sm-6 col-md-3" >
                    <Card
                    onClick={viewArea}
                    text={'dark'}
                    className="mb-2 shadow"
                   
                    >
                    <Card.Header bg={'secondary'} className="bg-dark text-light overflow-hidden">Area {props.area}</Card.Header>
                    <Card.Body style={{ backgroundImage: `url(${bg1})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', height:'10vh', overflow:'hidden', fontWeight:'bold'}}>
                        <Card.Text className='text-light'>
                         {props.desc}
                        </Card.Text>
                    </Card.Body>
                    </Card>
                </div>
    );
}


export default AreaCard;

// function AreaCard(props){
//     function redirect(e){
//         window.location.href = './home/area'+e
//     }
//     return(
//                 <div className="col-8 col-md-3 col-lg-2 mx-3 mx-sm-2 my-2 p-0" onClick={()=>{redirect(props.area)}}>

//                     <div className="card text-white shadow-lg" style={{ maxWidth: '18rem', height: '10rem'}}>
//                         <div className="card-header bg-dark"><h5>Level {props.area}</h5></div>
//                         <div className="card-body bg-secondary overflow-hidden">
//                             <p className="card-text px-1 py-0 py-sm-3 text-center">{props.desc}</p>
//                         </div>
//                     </div>

//                 </div>
//     );
// }


// export default AreaCard;