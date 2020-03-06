import React, { useEffect, useState } from 'react';
import '../dashboard.scss';




function stockList() {
 
  let stocks = {'AAPL':5,'GOOG':1}

  return (
    
    <div className='stockCard' style={{color:"black"}}>
      <div className='stockObject'>
        TSLA 700
        <div className='stockPercent'>{-5}%</div>
      </div>
      {Object.keys(stocks).map((stock)=>{
            return <div className='stockObject'>{stock}:{Math.round(Math.random()*1000)} 5%<br /></div> 
            
          })}
    </div>
        
  
  );
}

export default stockList;