import React, { useEffect, useState } from 'react';
;



function StockGetter() {
  const [portfolio, setPortfolio] = useState(null)
  
  async function getData() {
    let res = await fetch('/dashboard/portfolioValue/1')
    let data = await res.json()
    setPortfolio(await data.value)
    
  }
  useEffect(() => {
    getData()
  }, [])

  return (
    <div>
      
      {portfolio}

    </div>
  );
}

export default StockGetter;