import React, { useEffect, useState } from 'react';
import StockCard from './StockCard'
import '../dashboard.scss';
import AddStock from './AddStock'



function stockList() {

  let stocks = { 'AAPL': 5, 'GOOG': 0, 'TSLA': 7, 'AMD': 1000, 'RED': 5, 'BKH': 1, 'VUSA': 7, 'SNAP': 10, 'g': 1, 'aedf': 3, 'rte': 1, 'hi': 1, 'BYE': 2, 'byew': 2, 'aeldf': 3, 'rtle': 1, 'hli': 1, 'byle': 2, 'blyew': 2, 'AMAZO': 10000 }

  return (
    <div>
      <AddStock />
      <div className={`stockCard`} style={{ color: "black", paddingRight: '10px', height: '85vh', overflowY: 'scroll' }}>

        {Object.keys(stocks).map((stock) => {
          return <StockCard stock={stock} key={stock} amountHeld={stocks[stock]} />
        })}
      </div>
    </div>

  );
}

export default stockList;