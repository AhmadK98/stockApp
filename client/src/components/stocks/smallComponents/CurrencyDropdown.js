import React, { useEffect, useState } from 'react';
import '../dashboard.scss';

function useLocalStorageCurrency(currencyOption, defaultValue) {
  const flagClasses = { 'GBP': 'flag-icon-gb', 'USD': 'flag-icon-us', 'PKR': 'flag-icon-pk', 'EUR': 'flag-icon-nl' }

  const [currency, setCurrency] = useState(window.localStorage.getItem('currencyOption'))
  const [flag, setFlag] = useState(flagClasses[window.localStorage.getItem('currencyOption')])


  useEffect(() => {
    window.localStorage.setItem('currencyOption', currency)
    setFlag(flagClasses[window.localStorage.getItem('currencyOption')])
  }, [currency, flag])
  return [currency, setCurrency, flag]
}

function CurrencyDropdown() {

  const flagClasses = { 'GBP': 'flag-icon-gb', 'USD': 'flag-icon-us', 'PKR': 'flag-icon-pk', 'EUR': 'flag-icon-nl' }

  // const [currency, setCurrency] = useState(window.localStorage.getItem('currencyOption') || 'GBP')
  const [currency, setCurrency, flag] = useLocalStorageCurrency(window.localStorage.getItem('currencyOption'), 'GBP')
  // const [flag, setFlag] = useState(flagClasses[window.localStorage.getItem('currencyOption')])


  // // let changeCurrency = (currency) => {
  // //   window.localStorage.setItem('currencyOption', currency)

  // // }

  // useEffect(() => {
  //   window.localStorage.setItem('currencyOption', currency)
  //   console.log(flag)
  // }, [currency, flag])


  return (

    <div class="dropdown col-md">
      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <div className={flag + ' flag-icon h col-md'}></div>
        {currency}
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a className="dropdown-item" onClick={() => { setCurrency('GBP') }}><div className="flag-icon-gb flag-icon"></div><span> &emsp; GBP</span></a>
        <a className="dropdown-item" onClick={() => { setCurrency('USD') }}><div class="flag-icon-us flag-icon"></div><span> &emsp; USD</span></a>
        <a className="dropdown-item" onClick={() => { setCurrency('PKR') }}><div className="flag-icon-pk flag-icon"></div><span> &emsp; PKR</span></a>
        <a className="dropdown-item" onClick={() => { setCurrency('EUR') }}><div className="flag-icon-nl flag-icon"></div><span> &emsp; EUR</span></a>
      </div>
    </div >

  );
}

export default CurrencyDropdown;