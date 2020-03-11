import React, { useEffect, useState } from 'react';
import '../dashboard.scss';




function StockCard(props) {


  return (

    <div className='stockObject' style={{ marginBottom: '10px' }}>
      <span className='stockName' style={{ marginRight: '3px', fontSize: '15px' }}>{props.stock}</span>
      <span className='stockPrice' style={{ marginRight: '3px', fontSize: '15px' }}>${Math.round(Math.random() * 1000)}</span>
      <span className='amountHeld' style={{ float: 'right', marginRight: '5px' }}>{props.amountHeld}</span>
      <div className='stockPercent'>{Math.round(Math.random() * 10)}%</div>
    </div>

  );
}

export default StockCard;