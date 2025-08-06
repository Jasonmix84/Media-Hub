import { Outlet, Link } from 'react-router-dom'
import './Layout.css'

function Layout() {
    return ( 
        <div>
            <nav className="navbar">
                <h3>Media Hub</h3>
                <Link style={{ color: "white" }} to="/" className="nav-btn">Home</Link>
                <Link style={{ color: "white" }} to="/Login" className="nav-btn">Login or Sign Up</Link>

            </nav>
            <Outlet />
        </div>
    )
}

export default Layout