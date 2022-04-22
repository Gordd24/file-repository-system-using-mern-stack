import logout from '../page-components/Logout';

function Area1(){
    
    return(
        <div className="h-100">
                <div className="row navbar-static-top">
                    <div className="col">
                    
                        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                            <div className="container-fluid">
                                <a className="navbar-brand" href="/home">CICT Drive</a>

                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>

                                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                                    <div className="navbar-nav">
                                        <a className="nav-link active" href="/home">Home</a>
                                        <a className="nav-link" href="/registration">Registration</a>
                                        <a className="nav-link" href="#">Logs</a>
                                        <li className="nav-item dropdown">
                                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                My Account
                                            </a>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li><a className="dropdown-item" href="#">Update</a></li>
                                                <li><a className="dropdown-item" onClick={logout} href='#'>Sign Out</a></li>
                                            </ul>
                                        </li>
                                    </div>
                                </div>

                            </div>
                        </nav>   

                        </div>
                    </div>

                    <div className="row m-2 shadow-lg">
                        <div className="col d-flex flex-column">

                            <div className="row border p-1 shadow">
                                <div className="col p-1">
                                    directory
                                </div>
                            </div>


                            <div className="row border mt-1" style={{ height: '84vh'}}>

                                <div className="col-2 shadow d-none d-lg-block">
                                    <div className='row bg-dark text-light align-items-center' style={{ height: '7.5%'}}>
                                        <div className='col'>
                                            Area 1
                                        </div>
                                    </div>

                                    <div className='row text-light justify-content-center p-2' style={{ height: '92.5%'}}>
                                        <div className='col-12'>

                                            <button className='btn border-primary form-control my-2'>Create Folder</button>

                                            <button className='btn border-warning form-control my-2'>Upload File</button>
                                        </div>
                                    </div>

                                </div>

                                <div className="col-12 col-lg-10 p-2">

                                    <div className="row text-center mb-1 d-xs-block d-sm-block d-lg-none d-xl-none">
                                        <div className="col-4 col-md-2">
                                            <div className="dropdown border rounded shadow bg-dark">
                                                <a className="nav-link text-light" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Area 1
                                                </a>
                                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                    <li className='dropdown-item'>Create Folder</li>
                                                    <li className='dropdown-item'>Upload File</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col">
                                            <table className="table shadow">
                                                <thead className="thead-dark bg-dark text-light">
                                                    <tr>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Type</th>
                                                    <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Sample.txt</td>
                                                        <td>Text File</td>
                                                        <td>
                                                            <button className="btn-secondary mx-1">Move</button>
                                                            <button className="btn-secondary mx-1">Delete</button>
                                                            <button className="btn-secondary mx-1">Download</button>
                                                            <button className="btn-secondary mx-1">Open</button>
                                                        </td>
                                                    </tr>
                                                </tbody>                            
                                            </table>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>


        </div>
    )
}


export default Area1;