function Level(props){
    return(
                // <div className="col-8 col-md-3 col-lg-2 mx-3 mx-sm-2 my-2">
                <div className="col-12 col-sm-10 shadow overflow-hidden my-2" style={{height:'20vh'}}>

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


export default Level;