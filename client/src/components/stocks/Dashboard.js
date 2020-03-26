import React, { useEffect, useState } from 'react';
import './dashboard.scss';
import CurrencyDropdown from './smallComponents/CurrencyDropdown'
import StockList from './smallComponents/StockList'
import PortfolioGraph from './smallComponents/PortfolioGraph';
import AddStock from './smallComponents/AddStock'


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
    document.title = `£10000 - Stock Tracker` //change
  }, [])


  return (

    <div className="dashboard">

      <div className="row">

        <div className="col-md-1" style={{ color: "red", marginTop:'9px', marginLeft:'15 px' }}>
          <span>Portfolio</span>
        </div>

        <div className='test col-md-7' style={{ color: "red" }} >
          <span style={{ fontSize: '0.7em' }}>Your portfolio value: </span>
          <div className='test2'>£1000.04</div>
        </div>
       
        <div className="col-md-3" style={{marginRight: '0px' }}>
          <CurrencyDropdown />
        </div>
          
        
   
        <div className="col-md-3">
          <StockList />
        </div>

        <div className='container col-md-9 col-xs-5' style={{ background: 'none' }}>
          

          <div className="col-md-12">
            <PortfolioGraph />
          </div>
          
          <div>
            <AddStock />
          </div>
        </div>
    </div>
  </div>
  );
}

export default Dashboard;