const express = require('express')
const router = express.Router()
const stockHandler = require('../database/stockHandler')
const stockHandlerNew = require('../database/stockHandlerNew')
const userData = require('../database/userDataHandler')

router.get('/portfoliovalue/:id', async (req, res) => {
    let value = userData.getPortfolio(req.params.id, 'GBP')
    let stocks = userData.getStocksOwned(req.params.id)
    // .then(data => res.json(data))
    // .catch(err => res.json('Could not retrieve data'))
    res.json({ value: await value, stocks_owned: await stocks })
})




module.exports = router