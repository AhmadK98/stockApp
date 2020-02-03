import React, {useEffect, useState} from 'react';
import '../../App.css';



function StockGetter() {
   const [portfolio, setPortfolio] = useState(null) 

    useEffect(async () => {
      let res = await fetch('/dashboard/portfolioValue/1')
      let data = await res.json()
      console.log(await data)
      setPortfolio(data.value)
    },[])
  
  return (
    <div className="App">
      <header className="App-header">
        {portfolio}
      </header>
    </div>
  );
}

export default StockGetter;