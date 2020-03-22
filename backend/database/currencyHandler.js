const fetch = require('node-fetch')
const express = require('express');
const { pool } = require('./pool')

// fetch('http://data.fixer.io/api/latest?access_key=27f41a0d85a9f902039854550b99758f&symbols=USD,AUD,CAD,GBP,PKR')
//  .then(res => res.json())
//  .then(data => Object.keys(data.rates).forEach((symbol) =>{
//      params = [symbol, data.rates[symbol]]

//      try{
//         pool.query(`INSERT INTO currency (
//                 symbol, 
//                 gbp_convert, 
//                 date)
//             VALUES($1,$2, current_date)`, params)
//      }catch(err){
//          console.log(err)
//      }
//  })
//  )

const updateCurrency = async () => {
    const res = await fetch('http://data.fixer.io/api/latest?access_key=27f41a0d85a9f902039854550b99758f&symbols=USD,AUD,CAD,GBP,PKR')
    const data = await res.json()
    Object.keys(await data.rates).forEach((symbol => {
        pool.query(`UPDATE currency SET conversion = ${data.rates[symbol]}, time = current_time WHERE symbol = '${symbol}'`)
    }))
}

const convertValue = async (ticker, currency) => {
    try {
        const response = await pool.query(`SELECT ticker, price, currency symbol, ROUND(price * ((SELECT conversion FROM currency WHERE symbol = upper('${currency}'))/conversion),2) converted 
                    FROM stocks
                    JOIN currency on stocks.currency = currency.symbol
                    WHERE ticker = upper('${ticker}')`)
        response.rows[0].newSymbol = currency.toUpperCase()
        return await response.rows
    } catch (err) {
        return err
    }
}



// convertValue('vusa.l', 'USD').then(res => console.log(res))
// updateCurrency().then(()=>console.log('bye'))

