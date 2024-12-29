import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBarStyles.css';
import { FiLogOut } from 'react-icons/fi';
import { useLocation } from "react-router-dom";
// import app from '../Images/icon.png'

const NavBar = () => {
    // const user = location.state?.user;
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate('/');
    };

    return (
        <nav className="navbar">
            <ul className="navbar-list">
                {/* <li>
                    <img src={app} style={{ width: '20px', height: '20px' }}></img>
                </li> */}
                <li className="navbar-item">
                    <Link to="/" className="navbar-link">Home</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/product" className="navbar-link">Product</Link>
                </li>
                {user && location.pathname === '/product' ? (
                    <li>
                        <div className="username" onClick={handleLogout}>
                            Hello! <span className="username-display">{user.displayName?.split(" ")[0] || 'Guest'}</span>
                        </div>
                    </li>
                ) : null}

                {user && location.pathname === '/product' ? (
                    <li>
                        <div className="logout-button" onClick={handleLogout}>
                            <FiLogOut size={20} style={{ cursor: 'pointer', color: '#fed0bb', fontWeight: 'bolder', marginLeft: '10px' }} />
                        </div>
                    </li>
                ) : null}
            </ul>
        </nav>
    );
};

export default NavBar;
