const { pool } = require("./pool");

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

const noOfStocks = async () => {
	let data = await pgQuery(`SELECT COUNT(ticker) FROM stocks`);
	return data.rows[0]["count"];
};

const marketHours = () => {
	data = {};
	currentTime = new Date();

	if (currentTime.getHours() >= 7 && currentTime.getHours() <= 15 && currentTime.getDay() != 6 && currentTime.getDay() != 0) {
		if (currentTime.getHours() == 15 && currentTime.getMinutes() < 30) {
			data["UKMarket"] = "open";
		} else {
			data["UKMarket"] = "closed";
		}
		data["UKMarket"] = "open";
	} else {
		data["UKMarket"] = "closed";
	}

	if (currentTime.getHours() >= 13 && currentTime.getHours() < 20 && currentTime.getDay() != 6 && currentTime.getDay() != 0) {
		if (currentTime.getHours() == 13 && currentTime.getMinutes() > 30) {
			data["USMarket"] = "open";
		} else {
			data["USMarket"] = "closed";
		}
		data["USMarket"] = "open";
	} else {
		data["USMarket"] = "closed";
	}
	ukMarketTime = new Date();
	usMarketTime = new Date();

	if (data["UKMarket"] == "closed") {
		if (currentTime.getHours() >= 0 && currentTime.getHours() <= 7) {
			ukMarketTime.setDate(currentTime.getDate() - 1);
		}
	}
	if (data["USMarket"] == "closed") {
		if (currentTime.getHours() >= 0 && currentTime.getHours() <= 13 && currentTime.getMinutes() < 30) {
			usMarketTime.setDate(currentTime.getDate() - 1);
		}
	}

	ukMarketTime.setHours(15);
	ukMarketTime.setMinutes(30);
	ukMarketTime.setSeconds(0);

	usMarketTime.setHours(20);
	usMarketTime.setMinutes(0);
	usMarketTime.setSeconds(0);

	data["USMarketTime"] = usMarketTime;
	data["UKMarketTime"] = ukMarketTime;

	return data;
};

module.exports.marketHours = marketHours;
