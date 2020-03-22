import React, { useEffect, useState } from 'react';
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
   
    const [search, setSearch] = useState('')

    useEffect((e)=>{  
        fetch('https://cors-anywhere.herokuapp.com/https://services.dowjones.com/autocomplete/data?q=vusa&it=fund,exchangetradedfund,stock,Index,Currency,Benchmark,Future,Bond,CryptoCurrency&count=5&need=symbol,private-company&excludeexs=XBAH,XCNQ,XTNX,XCYS,XCAI,XSTU,XBER,XHAN,XTAE,XAMM,XKAZ,XKUW,XCAS,XMUS,XKAR,DSMD,XMIC,RTSX,XSAU,XBRA,XCOL,XADS,XDFM,XCAR,XMSTAR,XOSE',{
            headers: {
                'Accept': 'application/json',
                // 'Origin': 'https://www.wsj.com',
                'Accept-Encoding': 'gzip, deflate, br',
                'Host': 'services.dowjones.com',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Safari/605.1.15',
                'Accept-Language': 'en-gb',
                // 'Referer': 'https://www.wsj.com/',
                'Connection': 'keep-alive',
            }
        }).then(async (data)=>{
            
            console.log(await data.json())
        })
        
    },[search])

    return (

        <div className="navbar sticky-top">

            <div className="container col-md-11">
                <NavLink to="/" className='home'>stockTracker</NavLink>
                <NavLink to="/dash" className='dashboard'>Dashboard</NavLink>
                {/* <div className */}
                <input class="form-control col-md-3 searchBar" type="text" placeholder="Search for a stock" onChange={(e)=>setSearch(e.target.value)} ></input>
                <NavLink to="/login" className='login'>Login</NavLink>
                

            </div>

        </div>
    )
}

export default Navbar;