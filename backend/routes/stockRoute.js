const express = require('express')
const router = express.Router()
const stockHandler = require('../database/stockHandler')
const fetch = require('node-fetch')

router.get('/value/:stock', (req, res) => {
    let includeTime = req.query.includeTime ? true : null
    stockHandler.getCurrentValue(req.params.stock, includeTime)
        .then(data => res.json(data))
        .catch(err => res.json('Could not retrieve data'))

})

router.get('/search/:stock', async (req, res) => {

    if (req.params.stock.length >= 1) {
        console.log(req.params.stock)
        let request = await fetch(`https://services.dowjones.com/autocomplete/data?q=${req.params.stock}&it=fund,exchangetradedfund,stock,Index,Currency,Benchmark,Future,Bond,CryptoCurrency&count=5&need=symbol,private-company,person,suggested-search-term,topic,omniture-keyword&excludeexs=XBAH,XCNQ,XTNX,XCYS,XCAI,XSTU,XBER,XHAN,XTAE,XAMM,XKAZ,XKUW,XCAS,XMUS,XKAR,DSMD,XMIC,RTSX,XSAU,XBRA,XCOL,XADS,XDFM,XCAR,XMSTAR,XOSE`)
        let data = await request.json()
        res.json(data)
    }

})

module.exports = router