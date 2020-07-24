import React from 'react';
import './navbar.scss';
import {
    // BrowserRouter as Router,
    // Switch,
    // Route,
    NavLink,
    // useHistory
} from "react-router-dom";

// import StockGetter from '../stocks/Dashboard'



function Navbar(props) {
   
    // const [search, setSearch] = useState('d')

    // useEffect( ()=>{  
        
    async function searchStock(e) {
        let res = await fetch(`/stocks/search/${e}`)
        let data = await res.json()
        console.log(data)
    }
        
    //     searchStock()
        
    // },[search])

    return (

        <div className="navbar sticky-top">

            <div className="container col-md-11">
                <NavLink to="/" className='home'>stockTracker</NavLink>
                <NavLink to="/dash" className='dashboard'>Dashboard</NavLink>
                {/* <div className */}
                <input className="form-control col-md-3 searchBar" type="text" placeholder="Search for a stock" onChange={(e)=>searchStock(e.target.value)} ></input>
                <NavLink to="/login" className='login'>{(props.loggedIn ? 'Login':'Logout')}</NavLink>
                

            </div>

        </div>
    )
}

export default Navbar;