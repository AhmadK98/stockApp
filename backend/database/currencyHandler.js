const fetch = require('node-fetch')
const express = require('express');
const { pool } = require('./pool')

fetch('http://data.fixer.io/api/latest?access_key=27f41a0d85a9f902039854550b99758f&symbols=USD,AUD,CAD,GBP,PKR')
 .then(res => res.json())
 .then(data => Object.keys(data.rates).forEach((symbol) =>{
     params = [symbol, data.rates[symbol]]
     
     try{
        pool.query(`INSERT INTO currency (
                symbol, 
                gbp_convert, 
                date)
            VALUES($1,$2, current_date)`, params)
     }catch(err){
         console.log(err)
     }
 })
 )

// const updateCurrency = async () => {
//     const res = await fetch('https://api.exchangeratesapi.io/latest?base=GBP')
//     const data = await res.json()
//     Object.keys(await data.rates).forEach((symbol => {
//         pool.query(`UPDATE currency SET gbp_convert = ${data.rates[symbol]} WHERE symbol = '${symbol}'`)
//     }))
// }

// updateCurrency()

 