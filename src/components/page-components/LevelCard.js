import { Card } from 'react-bootstrap';
import bg1 from '../img/bg1.png'
function LevelCard(props){

    function viewLevel(){
        window.location.href='/home/level/'+props.level
    }
    return(
                <div className="col-12 col-sm-6 col-md-4">
                        <Card
                        onClick={viewLevel}
                        text={'dark'}
                        className="mb-2 shadow"
                        >
                        <Card.Header bg={'secondary'} className="bg-dark text-light">Level {props.level}</Card.Header>
                        <Card.Body style={{ backgroundImage: `url(${bg1})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                            <Card.Text className="m-4 text-light">
                                <strong>{props.desc}</strong>
                            </Card.Text>
                        </Card.Body>
                        </Card>

                </div>
               


    );
}


export default LevelCard;