import { Card } from 'react-bootstrap';
import bg1 from '../img/bg1.png'
function PhaseCard(props){

    function viewPhase(){
        window.location.href='/home/level/'+props.level+'/'+props.phase
    }
    
    return(
                <div className="col-12 col-sm-6 col-md-3">
                <Card
                onClick={viewPhase}
                text={'dark'}
                className="mb-2 shadow"
                >
                <Card.Header bg={'secondary'} className="bg-dark text-light">Phase {props.phase}</Card.Header>
                <Card.Body style={{ backgroundImage: `url(${bg1})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                    <Card.Text className="m-4" style={{textShadow: '4px 4px 24px rgba(251,251,251,1)'}}>
                    </Card.Text>
                </Card.Body>
                </Card>

                </div>
    );
}


export default PhaseCard;