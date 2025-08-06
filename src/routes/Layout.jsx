import { Outlet, Link } from 'react-router-dom'
import './Layout.css'

function Layout() {
    return (
        <div className="Layout">
            <nav className="navbar">
                <h3>Media Hub</h3>
                <Link style={{ color: "white" }} to="/" className="nav-btn">Home</Link>
                <Link style={{ color: "white" }} to="/Login" className="nav-btn">Login or Sign Up</Link>
            </nav>
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout