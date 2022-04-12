function AreaCard(props){
    return(
                <div className="col-8 col-md-3 col-lg-2 mx-3 mx-sm-2 my-2 p-0">

                    <div className="card text-white shadow-lg" style={{ maxWidth: '18rem', height: '10rem'}}>
                        <div className="card-header bg-dark"><h5>Area {props.area}</h5></div>
                        <div className="card-body bg-secondary overflow-hidden">
                            <p className="card-text px-1 py-0 py-sm-3 text-center">{props.desc}</p>
                        </div>
                    </div>

                </div>
    );
}


export default AreaCard;