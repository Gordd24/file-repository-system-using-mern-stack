import React from "react";
import "../css/style.css"

function Field(props){
    return(
        <div className="row m-3">
            <div className="col">
                <label className="" htmlFor={props.placeholder}>
                    {props.placeholder+' '+props.required}           
                </label>
                <input type={props.type} placeholder={props.placeholder} id={props.placeholder} className="form-control" value={props.val} onChange={(e)=> props.setVal(e.target.value)}/>
                <div className="error">{props.error}</div>
                <div className="error">{props.errorExist}</div>    
            </div>
        </div>
    )
}



export default Field;