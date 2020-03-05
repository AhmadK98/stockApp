import React, { useEffect, useState } from 'react';
import './dashboard.scss';
import CurrencyDropdown from './smallComponents/CurrencyDropdown'



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
    <div class="dashboard">

      <div class="row">
        <div class='col-md'>
          portfolio value: 1000
          </div>
        <CurrencyDropdown />

      </div>

      <div class="row">
        <div class="col-md-1 g">
          Portfolio flue: {portfolio.value}
        </div>

        <div class="col-md-10 g">
          Portfolio Value: {portfolio.value}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;