const { pool } = require("./pool");

const getPortfolio = async (id, currency) => {
	const params = [id, currency];
	const value = await pool.query(
		`SELECT ROUND(SUM(value * ((SELECT conversion FROM currency WHERE symbol = upper($2))/conversion)),2) total FROM 
        (SELECT id, stocks.ticker, quantity, price, quantity * price AS value, currency FROM
        (SELECT id ,upper(key) ticker, value::numeric quantity FROM
        (SELECT id, stocks_owned FROM users
        WHERE id = $1) AS userdata (id, data)
        JOIN jsonb_each_text(userdata.data) d ON TRUE) AS complete_data
        JOIN stocks ON stocks.ticker=complete_data.ticker) AS total_value
        JOIN currency on total_value.currency = currency.symbol`,
		params
	);
	return value.rows[0].total;
};
// getPortfolio(1, 'GBP').then((data)=>console.log(data))

const getStocksOwned = async (id) => {
	try {
		params = [id];
		let data = await pool.query(
			`SELECT user_table.ticker, name, amount, price, currency, latest_time FROM
		(SELECT d.key ticker, d.value amount from
        (SELECT stocks_owned FROM users WHERE id = $1) q
        LEFT JOIN jsonb_each_text(q.stocks_owned) d ON true ) as user_table
		JOIN (SELECT * from stocks) as stock_table 
		ON user_table.ticker = stock_table.ticker`,
			params
		);
		return data.rows;
	} catch (err) {
		return "ERROR";
	}
};

const assignStock = async (user, ticker, quantity) => {
	try {
		params = [user, ticker, quantity];
		const res = await pool.query(
			`UPDATE users
                                SET stocks_owned = stocks_owned || jsonb_build_object($2::text,$3::numeric)
                                WHERE id = $1`,
			params
		);
	} catch (err) {
		console.log(err);
	}
};
// assignStock(7,'TSLA',4)

const removeStock = async (user, ticker) => {
	try {
		params = [user, ticker.toUpperCase()];
		const res = await pool.query(
			`UPDATE users
                                SET stocks_owned = stocks_owned - $2
                                WHERE id = $1`,
			params
		);
		if (res.rowCount < 1) {
			return "ERROR";
		} else {
			console.log(res.rowCount);
			return "SUCCESS";
		}
	} catch (err) {
		console.log(err);
	}
};

const assignMultipleStocks = async (user, tickersQuantity) => {
	Object.keys(tickersQuantity).map((key) => {
		assignStock(user, key, tickersQuantity[key]);
	});
};

// const getValuesOfStocksOwned = async (stocks) => {
// 	console.log(`OR ticker = '${stocks}'`);
// };

// getValuesOfStocksOwned(["TSLA", "MSFT"]);
// getStocksOwned(1).then((data) => console.log(data));

// getStocksOwned(1).then((data) => console.log(data["JD.L"]));
module.exports.getPortfolio = getPortfolio;
module.exports.getStocksOwned = getStocksOwned;
