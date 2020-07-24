const fetch = require("node-fetch");
const express = require("express");
const { pool } = require("./pool");

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
	const res = await fetch("http://data.fixer.io/api/latest?access_key=27f41a0d85a9f902039854550b99758f&symbols=USD,AUD,CAD,GBP,PKR");
	const data = await res.json();
	Object.keys(await data.rates).forEach((symbol) => {
		pool.query(`UPDATE currency SET conversion = ${data.rates[symbol]}, time = current_time, date = current_date  WHERE symbol = '${symbol}'`);
	});
};

const convertValue = async (ticker, currency) => {
	console.time();
	try {
		const response = await pool.query(`SELECT ticker, price, currency symbol, ROUND(price * ((SELECT conversion FROM currency WHERE symbol = upper('${currency}'))/conversion),2) converted 
                    FROM stocks
                    JOIN currency on stocks.currency = currency.symbol
                    WHERE ticker = upper('${ticker}')`);
		response.rows[0].newSymbol = currency.toUpperCase();
		console.timeEnd();
		return await response.rows;
	} catch (err) {
		return err;
	}
};

const currencyInfo = async () => {
	let currencies = {};

	const res = await pool.query("SELECT symbol, conversion, date::text, TO_CHAR(time::time,'HH24:MI') FROM currency");
	data = res.rows;
	// console.log(data);
	await data.map((currency) => {
		currencies[currency["symbol"]] = { currency: currency["conversion"], date: `${currency["date"]} ${currency["to_char"]} UTC ` };
	});

	// console.log(currencies);
	return currencies;
};

// pool.query("SELECT jsonb_build_object(currency.symbol,currency) FROM currency").then((res) => {
// 	let data = res.rows;
// 	console.log(data[0]);
// });
// currencyInfo().then((data) => console.log(data));
// currencyInfo().then((data) => console.log(data["EUR"]));
// convertValue("TSLA", "GBP").then(data => console.log(data));

module.exports.currencyInfo = currencyInfo;
// convertValue('TSLA', 'GBP').then(res => console.log(res))
// updateCurrency().then(() => console.log("bye"));
//
