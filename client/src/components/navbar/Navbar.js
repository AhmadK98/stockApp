import React, { useEffect, useState } from 'react';
import './navbar.scss';



function Navbar() {

    return (
        <div className="navbar">
            <div className="container">
                <div className="home">StockTracker</div>
                <div className="dashboard">Dashboard</div>
                <div className="login">Login</div>
            </div>

        </div>
    )
}

export default Navbar;