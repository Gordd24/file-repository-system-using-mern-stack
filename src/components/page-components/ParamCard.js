import { Card } from 'react-bootstrap';
import bg1 from '../img/bg1.png'
function ParamCard(props){

    function viewParam(){
        window.location.href='/home/level/'+props.level+'/'+props.phase+'/'+props.area+'/'+props.parameterNo
    }
    return(

                <div className="col-12 col-sm-6 col-md-3" >
                <Card
                onClick={viewParam}
                text={'dark'}
                className="mb-2 shadow"

                >
                <Card.Header bg={'secondary'} className="bg-dark text-light overflow-hidden">Parameter {props.parameterNo}</Card.Header>
                <Card.Body style={{ backgroundImage: `url(${bg1})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', height:'10vh', overflow:'hidden', fontWeight:'bold'}}>
                    <Card.Text className='text-light'>
                    {props.desc}
                    </Card.Text>
                </Card.Body>
                </Card>
                </div>
    );
}


export default ParamCard;