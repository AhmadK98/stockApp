import React, { useEffect, useState } from 'react';
import '../dashboard.scss';
const flagClasses = { 'GBP': 'flag-icon-gb', 'USD': 'flag-icon-us', 'PKR': 'flag-icon-pk', 'EUR': 'flag-icon-nl' }

function useLocalStorageCurrency(currencyOption, defaultValue) {
  
  const [currency, setCurrency] = useState(currencyOption || defaultValue)
  const [flag, setFlag] = useState(flagClasses[currencyOption])

  useEffect(() => {
    window.localStorage.setItem('currencyOption', currency)
    setFlag(flagClasses[currency])
  }, [currency, flag])
  
  return [currency, setCurrency, flag]
}


function CurrencyDropdown() {

  const [currency, setCurrency, flag] = useLocalStorageCurrency(window.localStorage.getItem('currencyOption'), 'GBP')

  return (

    <div class="dropdown" > 
      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <div className={flag + ' flag-icon h col-md'}></div>
        {currency}
      </button>
      
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {Object.keys(flagClasses).map((flag)=>{
          return (<a className="dropdown-item" onClick={() => { setCurrency(flag) }}><div className={flagClasses[flag] + ' flag-icon col-md'}></div>
                  <span className="currencyText col-md">{flag}</span></a>)
        })}
      </div>
    </div >
  );
}

export default CurrencyDropdown;