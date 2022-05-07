import logout from '../page-components/Logout';
import jwt_decode from 'jwt-decode'

let accountType = ''
if(localStorage.getItem('user')!==null){
    const user = localStorage.getItem('user')
    const object = JSON.parse(user)
    const accessToken = object.accessToken
    //decode the access token
    const decodeToken = jwt_decode(accessToken)
    accountType= decodeToken.type
}
function Navigation(){
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/home">CICT Drive</a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <a className="nav-link" href="/home">Home</a>
                        {
                            accountType ==='admin' &&
                            <a className="nav-link" href="/registration">Registration</a>
                        }
                        
                        <a className="nav-link" href="/Logs">Logs</a>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                My Account
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a className="dropdown-item" href="/profile">Update</a></li>
                                <li><a className="dropdown-item" onClick={logout} href='#'>Sign Out</a></li>
                            </ul>
                        </li>
                    </div>
                </div>

            </div>
        </nav> 
    )
}

export default Navigation