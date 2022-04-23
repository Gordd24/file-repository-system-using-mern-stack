function LevelCard(props){

    function viewLevel(){
        window.location.href='/home/level/'+props.level
    }
    return(
                <div className="col-12 col-sm-10 shadow overflow-hidden my-2" onClick={viewLevel} style={{height:'20vh'}}>

                        <div className="row border-bottom text-light rounded bg-dark" >
                            <div className="col">
                                <h4>Level {props.level}</h4>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col p-3">
                                {props.desc}
                            </div>
                        </div>

                </div>
    );
}


export default LevelCard;