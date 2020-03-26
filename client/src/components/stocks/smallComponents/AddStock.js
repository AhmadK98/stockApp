import React, { useEffect, useState } from 'react';

import './addStock.scss';


function AddStock() {
    
    async function searchStock(e) {
        let res = await fetch(`/stocks/search/${e}`)
        let data = await res.json()
        console.log(data)
    }

    return(
        <div>
            <input className="form-control col-md-3 searchBar" type="text" placeholder="Search for a stock" onChange={(e)=>searchStock(e.target.value)} ></input>
        </div>
    )
}

export default AddStock;