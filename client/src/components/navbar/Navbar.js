import React, { useEffect, useState } from 'react';
import './navbar.scss';



function Navbar() {

    return (
        <div class="navbar">
            <div class="container">
                <div class="home">StockTracker</div>
                <div class="dashboard">Dashboard</div>
                <div class="login">Login</div>
            </div>

        </div>
    )
}

export default Navbar;