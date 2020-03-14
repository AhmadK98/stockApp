import React, { useEffect, useState } from 'react';
import '../dashboard.scss';




function StockCard(props) {

  let test
  return (

    <div className={`stockObject ${props.stock}`} style={{ marginBottom: '10px' }}>
      <span className='stockName' style={{ marginRight: '3px', fontSize: '15px' }}>{props.stock}</span>
      <span className='stockPrice' style={{ marginRight: '3px', fontSize: '15px' }}>{`$${test = Math.round(Math.random() * 1000)}`}</span>
      <span className='total-value'>{`$${test*props.amountHeld}`}</span>
      
      <div>
        <span className='stockPercent'>{`${Math.round(Math.random() * 10)}%`}</span>
        <span className='amount-held' >{props.amountHeld}</span>
        {/* <span>g</span> */}
      </div>
      
    </div>

  );
}

export default StockCard;