function Field(props){
    return(
        <div className="row m-3">
            <div className="col">
                <input type={props.type} placeholder={props.placeholder} className="form-control" value={props.val} onChange={(e)=> props.setVal(e.target.value)}/>
            </div>
        </div>
    )
}

export default Field;