import React, { useEffect, useState } from 'react';
import StockCard from './StockCard'
import '../dashboard.scss';




function stockList() {
 
  let stocks = {'AAPL':5,'GOOG':1, 'TSLA':7,'AMD':10,'RED':5,'BKH':1, 'VUSA':7,'SNAP':10,'g':1,'aedf':3,'rte':1,'hi':1,'BYE':2,'byew':2,'aeldf':3,'rtle':1,'hli':1,'byle':2,'blyew':2}

  return (
    
    <div className='stockCard' style={{color:"black"}}> 
    My Stocks
      {Object.keys(stocks).map((stock)=>{
            return  <StockCard stock={stock} amountHeld={stocks[stock]}/>
          })}
    </div>
        
  
  );
}

export default stockList;