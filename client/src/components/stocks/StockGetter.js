import React, { useEffect, useState } from 'react';
;



function StockGetter() {
  const [portfolio, setPortfolio] = useState({
    value:null,
    stocksOwned:null})
  
  async function getData() {
    let res = await fetch('/dashboard/portfolioValue/1')
    let data = await res.json()
    setPortfolio(await data)
    
    
  }
  useEffect(() => {
    getData()
  }, [])

  return (
    <div>
      
      {/* Portfolio Value: {portfolio.value} */}

    </div>
  );
}

export default StockGetter;