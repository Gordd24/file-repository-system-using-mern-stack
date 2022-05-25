function ProfileCard(props){
    return(
        <div className='row border rounded shadow mx-1 mt-3 mb-3'>
        <div className='col'>
            <div className='pt-3 px-2'>
                <h4 className=''>{props.firstName+' '+props.middleName+' '+props.lastName}</h4>
                <h6 className=''>{'('+props.username+')'}</h6>
            </div>
            <hr/>
            <div className='p-3'>
                <dl className="row">

                <dt className="col-sm-2">Email:</dt>
                <dd className="col-sm-10">{props.email}</dd>

                <dt className="col-sm-2">Role:</dt>
                <dd className="col-sm-10">{props.acc_type}</dd>

                <dt className="col-sm-2">Access:</dt>
                <dd className="col-sm-10">{props.acc_type}</dd>

                <dt className="col-sm-12">Assignment:</dt>
                <dd className="col-sm-1"></dd>
                <dd className="col-sm-2"><strong>Level: </strong>{props.level}</dd>
                <dd className="col-sm-2"><strong>Phase: </strong>{props.phase}</dd>
                <dd className="col-sm-2"><strong>Area: </strong>{props.area}</dd>

                </dl>
            </div>
        </div>
    </div>
    )
}

export default ProfileCard