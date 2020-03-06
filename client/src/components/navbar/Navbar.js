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

            <div className="container col-md-11">
                <NavLink to="/" className='home'>stockTracker</NavLink>
                <NavLink to="/dash" className='dashboard'>Dashboard</NavLink>
                <input class="form-control col-md-2" type="text" placeholder="Search for a stock"></input>
                <NavLink to="/login" className='login'>Login</NavLink>
                

            </div>

        </div>
    )
}

export default Navbar;