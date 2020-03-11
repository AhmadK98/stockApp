import React, { useEffect, useState } from 'react';
import './dashboard.scss';
import CurrencyDropdown from './smallComponents/CurrencyDropdown'
import StockList from './smallComponents/StockList'

import PortfolioGraph from './smallComponents/PortfolioGraph';


function Dashboard() {

  const [portfolio, setPortfolio] = useState({
    value: null,
    stocksOwned: null
  })

  async function getData() {
    let res = await fetch('/dashboard/portfolioValue/1')
    let data = await res.json()
    setPortfolio(await data)


  }
  useEffect(() => {
    getData()
  }, [])


  return (
    <div className="dashboard">

      <div className="row">
        
        <div className='col-md-11 portfolio-value' style={{color:"black"}}>
          <div className='test' >
            <span style={{color:"black", fontSize:'0.7em'}}>Your portfolio value: </span>
            <div className='test2' style={{color:"black"}}>£1000.04</div>
          </div>
          
          </div>
        <div className="col-md-1" style={{marginRight:'0px'}}>
          <CurrencyDropdown />
        </div>

      </div>

      <div className="row">
        <div className="col-md-3">
          <StockList />
        </div>

        <div className="col-md-9">
          <PortfolioGraph />
        </div>
      </div>
      
    </div>
    
  );
}

export default Dashboard;