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

  import StockGetter from '../stocks/StockGetter'



function Navbar() {
    

    return (

        <div className="navbar">
            <div className="container">
           
                 
                    <NavLink to="/">
                        
                        <div className="home" style={{"display": "block", "background":'blue',"height":'100%'}}>Home</div>
                        
                    </NavLink>
                
                <div className="dashboard">
                    <NavLink to="/dash">Dashboard</NavLink>
                </div>
                <div className="login">
                    <NavLink to="/login">Login</NavLink>
                </div>
    
            </div>

        </div>
    )
}

export default Navbar;