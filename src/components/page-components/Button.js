function Button(props){

    
    return(
       
            <div className="col">
                <input type='submit' value={props.val} className={`btn-light form-control ${props.btnType}`}/>
            </div>
       
    )
}

export default Button;