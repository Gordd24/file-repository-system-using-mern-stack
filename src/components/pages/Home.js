import AreaCard from '../page-components/AreaCard'
import logout from '../page-components/Logout';




function Home(){
    
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

                            <div className="row border p-1">
                                <div className="col p-1">
                                    directory
                                </div>
                            </div>


                            <div className="row border py-4 overflow-auto" style={{ height: '84vh'}}>
                                <div className="col">

                                    {/* first row 3 boxes */}
                                    <div className="row justify-content-center my-3">

                                        <AreaCard desc="Mission, Vision, Goals and Objectives" area="1"/>
                                        <AreaCard desc="Faculty" area="2"/>
                                        <AreaCard desc="Curriculum and Instruction" area="3"/>
                                        <AreaCard desc="Students" area="4"/>
                                        <AreaCard desc="Research" area="5"/>

                                    </div>
                                    {/* END first row 3 boxes */}   

                                    {/* Second row 3 boxes */}
                                    <div className="row justify-content-center my-3">
                                      
                                        <AreaCard desc="Extension" area="6"/>
                                        <AreaCard desc="Library" area="7"/>
                                        <AreaCard desc="Physical Facilities" area="8"/>
                                        <AreaCard desc="Laboratories" area="9"/>
                                        <AreaCard desc="Administration" area="10"/>

                                    </div>
                                    {/* END Second row 3 boxes */}


                                    
                                

                                </div>
                            </div>
                        </div>
                    </div>


        </div>
    )
}


export default Home;