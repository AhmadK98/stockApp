const fetch = require("node-fetch");
const express = require("express");
const { pool } = require("./pool");
const apiGetters = require("../apiGetters");
const yahoo = require("../yahoo");
const stockManagement = require("./stockManagement");

const pgQuery = async (query, params) => {
	// send requests to db
	params = params || null;
	try {
		const res = await pool.query(query, params);
		return res;
	} catch (err) {
		return err;
	}
};

const getOneHistoricValue = async (ticker, date) => {
	// gets closest price to requested date

	try {
		try {
			dateValue = date ? new Date(date) : new Date();

			dateValuePlusOne = new Date(dateValue.setMonth(dateValue.getMonth() + 1));
			dateValue.setMonth(dateValue.getMonth() - 1);
			dateValue.setDate(dateValue.getDate() + 1);
		} catch (err) {
			throw "Invalid date format";
		}
		params = [ticker, dateValue, dateValuePlusOne];

		let response = await pgQuery(
			`
            SELECT g.key,g.price , CASE WHEN difference < INTERVAL '0' THEN (-difference) ELSE difference END difference FROM( 
            SELECT d.key , d.value price, d.key::timestamp - $2::timestamp as difference from
            (SELECT data FROM stocks WHERE ticker=$1) q
            JOIN jsonb_each_text(q.data) d ON true 
            WHERE d.key::timestamp < $2::timestamp
            OR  d.key::timestamp < $3::timestamp) as g
            ORDER BY difference ASC
            LIMIT 2`,
			params
		);
		let data;
		try {
			// data = await response.rows.slice(-1)[0].time_series
			data = await response.rows;

			for (let i = 0; i < data.length; i++) {
				day = new Date(data[i]["key"]).getDate();

				if (day == dateValue.getDate()) {
					return data[i];
				}
			}
			return data[0];
		} catch {
			data = response;
		}
		return data; //throw
	} catch (err) {
		if (err.errno !== undefined && (err.errno === "ECONNREFUSED" || err.errno === "ENOTFOUND")) {
			return `Can't connect to database`;
		} else {
			return err;
		}
	}
};

const getAllHistoricValue = async (ticker, from, to) => {
	// gets closing price stock of each day within the range

	try {
		try {
			fromDate = from ? new Date(from).toISOString() : new Date("1950").toISOString();
			toDate = to ? new Date(to).toISOString() : new Date().toISOString();
		} catch (err) {
			throw "Invalid date format";
		}
		params = [ticker, fromDate, toDate];
		let response = await pgQuery(
			`
            SELECT jsonb_agg(data_time) time_data ,jsonb_agg(price) price FROM (SELECT d.key data_time , d.value price from
				(SELECT data FROM stocks WHERE ticker=$1) q
				JOIN jsonb_each_text(q.data) d ON true 
				WHERE d.key::timestamp < $3::timestamp
				AND d.key::timestamp > $2::timestamp
				ORDER BY key desc) as t `,
			params
		);
		let data;
		try {
			// data = await response.rows.slice(-1)[0].time_series
			data = await response;
			// console.log(data);
		} catch {
			data = response;
		}
		return [
			response.rows,
			{
				range: {
					from: fromDate,
					to: toDate,
				},
			},
		]; //throw
	} catch (err) {
		if (err.errno !== undefined && (err.errno === "ECONNREFUSED" || err.errno === "ENOTFOUND")) {
			return `Can't connect to database`;
		} else {
			return err;
		}
	}
};

// getAllHistoricValue("TSLA").then((data) => console.log(data));

const getCurrentValue = async (ticker, country, includeTime) => {
	// returns latest price from db

	try {
		if (country && country.toUpperCase() == "UK") {
			ticker = ticker + ".L";
		}

		let res = await pgQuery(`SELECT d.key timevalue, d.value price from
        (SELECT data FROM stocks WHERE ticker='${ticker}') q
        JOIN jsonb_each_text(q.data) d ON true 
        ORDER BY key desc LIMIT 1 `);

		if (includeTime) {
			data = [res.rows[0]["price"], res.rows[0]["timevalue"]];
		} else {
			data = res.rows[0]["price"];
		}

		return data;
	} catch {
		throw "Error in getting current value";
	}
};

const insertStock = async (ticker, country) => {
	// inserts stock into db with latest price

	country = country || "US";

	try {
		// if (country == 'UK') {
		//     ticker[0] = ticker[0] + '.L'
		// }

		let params = [ticker[0]];
		let check = await pgQuery(`SELECT * FROM stocks WHERE ticker = $1`, params);

		if (check.rowCount == 0) {
			if (country) {
				stock = await yahoo.getStockData(ticker, "1d", "1d", "close", country);
			} else {
				stock = await yahoo.getStockData(ticker, "1d", "1d", "close");
			}
			// console.log(stock)

			let dataValue = `jsonb_build_object(to_timestamp('${stock.time}','YYYY-MM-DD HH24:MI:SS'),${await stock.currentValue})`;
			params = [await stock.ticker, await stock.name, stock.type, stock.country, await stock.currentValue, await stock.currency, await stock.time];
			let uploaded = await pgQuery(
				`INSERT INTO stocks (
                                    ticker,
                                    name,
                                    fund,
                                    country,
                                    data, 
                                    price,
									currency,
									latest_time) 
                                VALUES (upper($1),$2,$3,$4,${await dataValue},$5, $6,$7)`,
				params
			);
			// console.log(dataValue);
		} //add in response if price returns null values
	} catch (err) {
		console.log(err);
	}
};

const insertHistory = async (ticker, country) => {
	// adds in historical data from ipo

	let params = [ticker];
	// let currency = await pgQuery('SELECT currency FROM stocks WHERE ticker=upper($1)', params)
	let options = [
		["1d", "max"],
		["1d", "1y"],
		["15m", "5d"],
		["2m", "1d"],
	];

	let queryMajoris = [];

	let query;

	options.forEach(async (option) => {
		let queries = [];

		historicalData = await yahoo.getStockData(ticker, option[0], option[1], "close", country);

		// console.log(option[0], [option[1]])
		// console.log(historicalData)
		await Object.keys(historicalData["valueData"]).forEach((timestamp) => {
			let dataValue = `data || jsonb_build_object(to_timestamp('${timestamp}','YYYY-MM-DD HH24:MI:SS'),${historicalData["valueData"][
				timestamp
			].toFixed(2)})`;
			query = `UPDATE stocks SET data = ${dataValue} WHERE ticker = '${historicalData["ticker"]}'`;
			queries.push(query);
		});
		// setTimeout(() => { }, 1000)
		// console.log(queries)
		pgQuery(queries.join(";"));
	});
};

const insertStockComplete = async (ticker, country) => {
	// combines insertStock and insertHistory to have a complete entry
	insertStock(ticker, country).then(() => {
		insertHistory(ticker, country);
	});
};

// insertStock("NVDA");
const updateStock = async (ticker, country) => {
	// updates specific stock
	country = country ? country : "US";
	const current_data = await getCurrentValue(ticker, country, true);
	// console.log()

	msSinceUpdate = Math.abs(new Date() - new Date(await current_data[1]));
	daysSinceUpdate = msSinceUpdate / (1000 * 60 * 60 * 24);

	// console.log(daysSinceUpdate)
	let historicalData;
	if (daysSinceUpdate < 1) {
		historicalData = await yahoo.getStockData(ticker.toUpperCase(), "1m", "1d", "close", country);
	} else {
		historicalData = await yahoo.getStockData(ticker.toUpperCase(), "1m", "5d", "close", country);
	}

	pgQuery(`UPDATE stocks SET price = $1, latest_time = $2 WHERE ticker = $3`, [
		await historicalData["currentValue"],
		await historicalData["time"],
		await historicalData["ticker"],
	]);

	let queries = [];

	await Object.keys(historicalData["valueData"]).forEach((timestamp) => {
		let dataValue = `data || jsonb_build_object(to_timestamp('${timestamp}','YYYY-MM-DD HH24:MI:SS'),${historicalData["valueData"][timestamp].toFixed(
			3
		)})`;
		query = `UPDATE stocks SET data = ${dataValue} WHERE ticker = '${historicalData["ticker"]}'`;
		queries.push(query);
	});
	// console.log(queries);
	pgQuery(queries.join(";"));
};

const updateAll = async () => {
	// updates all stocks
	res = await pgQuery("SELECT ticker, country, latest_time FROM stocks");
	tickers = await res.rows;
	let interval = 0;
	let marketOpen = stockManagement.marketHours();

	let updateInterval = setInterval(() => {
		if (tickers[interval]["country"] == "UK") {
			// console.log(tickers[interval]['ticker'].slice(0, (tickers[interval]['ticker'].length - 2)))
			// console.log(tickers[interval]['country'])
			if (marketOpen["UKMarket"] == "open") {
				updateStock(tickers[interval]["ticker"].slice(0, tickers[interval]["ticker"].length - 2), tickers[interval]["country"]);
			} else {
				if (tickers[interval]["latest_time"] < new Date(stockManagement.marketHours()["UKMarketTime"] - 120000)) {
					updateStock(tickers[interval]["ticker"].slice(0, tickers[interval]["ticker"].length - 2), tickers[interval]["country"]);
				}
			}
		} else {
			if (marketOpen["USMarket"] == "open") {
				updateStock(tickers[interval]["ticker"], tickers[interval]["country"]);
			} else {
				if (tickers[interval]["latest_time"] < new Date(stockManagement.marketHours()["USMarketTime"] - 120000)) {
					updateStock(tickers[interval]["ticker"], tickers[interval]["country"]);
				}
			}
		}

		interval++;
		if (interval >= tickers.length) {
			clearInterval(updateInterval);
		}
	}, 1000);
};
// pgQuery("SELECT latest_time FROM stocks WHERE ticker = 'TSCO.L'").then((data) => {
// 	console.log(data.rows[0]["latest_time"]);
// 	console.log(new Date(stockManagement.marketHours()["UKMarketTime"] - 180000));
// 	console.log(data.rows[0]["latest_time"] > new Date(stockManagement.marketHours()["UKMarketTime"] - 120000));
// 	console.log(new Date(stockManagement.marketHours()["UKMarketTime"] - 30000));
// });
// updateAll();
// updateStock('GOOGL')

module.exports.getAllHistoricValue = getAllHistoricValue;
module.exports.getCurrentValue = getCurrentValue;
