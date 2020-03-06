import React
    // { useEffect, useState } 
    from 'react';
import './navbar.scss';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
    useHistory
} from "react-router-dom";

import StockGetter from '../stocks/Dashboard'



function Navbar() {


    return (

        <div className="navbar sticky-top">

            <div className="container">
                <NavLink to="/" className='home'>stockTracker</NavLink>
                <NavLink to="/dash" className='dashboard'>Dashboard</NavLink>
                <NavLink to="/login" className='login'>Login</NavLink>


            </div>

        </div>
    )
}

export default Navbar;