import React, {useEffect, useState} from 'react';
import '../../App.css';
const {getStocksOwned, getPortfolio} = require('../../../backend/database/userDataHandler')


function StockGetter() {
   const [totalWorth, setTotalWorth] = useState(null) 

    useEffect(() => {
      getPortfolio.then(data => setTotalWorth(data))
    },[])
  
  return (
    <div className="App">
      <header className="App-header">
        {getPortfolio}
      </header>
    </div>
  );
}

export default StockGetter;