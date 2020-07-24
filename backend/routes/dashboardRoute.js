const express = require("express");
const router = express.Router();

const stockHandler = require("../database/stockHandler");
const currencyHandler = require("../database/currencyHandler");
const userData = require("../database/userDataHandler");
const fetch = require("node-fetch");

router.get("/portfoliovalue/:id?", async (req, res) => {
	let value = await userData.getPortfolio(req.params.id, req.query.currency); // manual change
	let stocks = await userData.getStocksOwned(req.params.id, req.query.currency);
	

	// .then(data => res.json(data))

	// .catch(err => res.json('Could not retrieve data'))
	res.json({ value: await value, stocksOwned: await stocks });
});

router.get("/currency", async (req, res) => {
	let data = await currencyHandler.currencyInfo();

	// .then(data => res.json(data))

	// .catch(err => res.json('Could not retrieve data'))
	res.json(await data);
});

module.exports = router;
