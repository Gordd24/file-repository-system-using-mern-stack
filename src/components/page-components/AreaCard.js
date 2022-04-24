function AreaCard(props){

    function viewArea(){
        window.location.href='/home/level/'+props.level+'/'+props.phase+'/'+props.area
    }
    
    return(
                <div className="col-12 col-sm-10 shadow overflow-hidden my-2" onClick={viewArea} style={{height:'20vh'}}>

                        <div className="row border-bottom text-light rounded bg-dark" >
                            <div className="col">
                                <h4>Area {props.area}</h4>
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