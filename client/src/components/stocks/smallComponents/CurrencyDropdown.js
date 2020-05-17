import React, { useEffect, useState } from 'react';
import '../dashboard.scss';
const flagClasses = { 'GBP': 'flag-icon-gb', 'USD': 'flag-icon-us', 'PKR': 'flag-icon-pk', 'EUR': 'flag-icon-nl' }

function useLocalStorageCurrency(currencyOption, defaultValue) {

  const [currency, setCurrency] = useState(currencyOption || defaultValue)
  const [flag, setFlag] = useState(flagClasses[currencyOption])
  const [clone, setClone] = useState(flagClasses)
  useEffect(() => {
    window.localStorage.setItem('currencyOption', currency)
    setFlag(flagClasses[currency])
    let cloneObject = Object.assign({}, flagClasses);
    delete cloneObject[currency]
    setClone(cloneObject)
  }, [currency, flag])

  return [currency, setCurrency, flag, clone]
}


function CurrencyDropdown() {

  const [currency, setCurrency, flag, clone] = useLocalStorageCurrency(window.localStorage.getItem('currencyOption'), 'GBP')
  // console.log(clone)
  return (

    <div class="dropdown" style={{ witdh: '5px' }} >
      <button className="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <div className={flag + ' flag-icon h col-md'}></div>
        {/* {currency} */}
      </button>

      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ witdh: '5px' }}>
        {Object.keys((clone)).map((flag) => {

          return (<a className={`dropdown-item`} key={`${flag}-object`} onClick={() => { setCurrency(flag) }}><div className={flagClasses[flag] + ' flag-icon col-md'}></div>
            <span className={`currencyText col-md`} key={`${flag}-flag`}>{flag}</span>
            <div class="dropdown-divider"></div>
          </a>)
        })}
      </div>
    </div >
  );
}

export default CurrencyDropdown;