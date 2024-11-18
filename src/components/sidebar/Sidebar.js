import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faBell, faHouse, faTags, faBoxesStacked, faTruckFast, faBasketShopping, faUsers, faHandHoldingDollar, faUsersGear } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/logo.png';
import './sidebar.css';

const Sidebar = () => {
    const location = useLocation();

    const [user, setUser] = useState(null);

    // Minimize or show sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(JSON.parse(localStorage.getItem('isSidebarOpen')) || false);
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        localStorage.setItem('isSidebarOpen', !isSidebarOpen);  // Persist state
    };

    // Selected view
    const [selectedView, setSelectedView] = useState(localStorage.getItem('selectedView') || 'home');

    // Load user from localStorage on component mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Update selected view based on location changes
    useEffect(() => {
        setSelectedView(localStorage.getItem('selectedView'));
    }, [location]);

    return (
        <nav className={`sidebar-container ${isSidebarOpen ? 'close' : ''}`}>
            <header>
                <div className="image-text">
                    <span className="image">
                        <img src={logo} alt="Logo" />
                    </span>
                    <div className="text logo-text">
                        <span className="name">Smart Stock</span>
                        <span className="profession"></span>
                    </div>
                </div>
                <FontAwesomeIcon
                    icon={faAngleRight}
                    className="toggle"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                />
            </header>
            <div className="menu-bar">
                <div className="menu">
                    <ul className="menu-links">
                        <li className={`nav-link ${selectedView === "home" ? "selected" : ""}`}>
                            <Link to="/home">
                                <FontAwesomeIcon icon={faHouse} className="icon" />
                                <span className="text nav-text">Home</span>
                            </Link>
                        </li>

                        <li className={`nav-link ${selectedView === "categories" ? "selected" : ""}`}>
                            <Link to="/categories">
                                <FontAwesomeIcon icon={faTags} className="icon" />
                                <span className="text nav-text">Categories</span>
                            </Link>
                        </li>
                        <li className={`nav-link ${selectedView === "items" ? "selected" : ""}`}>
                            <Link to="/items">
                                <FontAwesomeIcon icon={faBoxesStacked} className="icon" />
                                <span className="text nav-text">Items</span>
                            </Link>
                        </li>
                        <li className={`nav-link ${selectedView === "providers" ? "selected" : ""}`}>
                            <Link to="/providers">
                                <FontAwesomeIcon icon={faTruckFast} className="icon" />
                                <span className="text nav-text">Providers</span>
                            </Link>
                        </li>
                        <li className={`nav-link ${selectedView === "purchases" ? "selected" : ""}`}>
                            <Link to="/purchases">
                                <FontAwesomeIcon icon={faBasketShopping} className="icon" />
                                <span className="text nav-text">Purchases</span>
                            </Link>
                        </li>
                        {user && user.admin && (
                            <>
                                <li className={`nav-link ${selectedView === "customers" ? "selected" : ""}`}>
                                    <Link to="/customers">
                                        <FontAwesomeIcon icon={faUsers} className="icon" />
                                        <span className="text nav-text">Customers</span>
                                    </Link>
                                </li>
                                <li className={`nav-link ${selectedView === "sales" ? "selected" : ""}`}>
                                    <Link to="/sales">
                                        <FontAwesomeIcon icon={faHandHoldingDollar} className="icon" />
                                        <span className="text nav-text">Sales</span>
                                    </Link>
                                </li>
                                <li className={`nav-link ${selectedView === "notification" ? "selected" : ""}`}>
                                    <Link to="/notification">
                                        <FontAwesomeIcon icon={faBell} className="icon" />
                                        <span className="text nav-text">Notification</span>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Only if the user is admin */}
                {user && user.admin && (
                    <div className="bottom-content">
                        <ul>
                            <li className={`${selectedView === "users" ? "selected" : ""}`}>
                                <Link to="/users">
                                    <FontAwesomeIcon icon={faUsersGear} className="icon" />
                                    <span className="text nav-text">Users</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Sidebar;
