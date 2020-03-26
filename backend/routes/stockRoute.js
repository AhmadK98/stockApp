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

router.get('/search/:stock', async (req,res) => {
    if (req.params.stock >= 1){
    response = await fetch(`https://services.dowjones.com/autocomplete/data?q=${req.params.stock}&it=fund,exchangetradedfund,stock,Index,Currency,Benchmark,Future,Bond,CryptoCurrency&count=5&need=symbol,private-company&excludeexs=XBAH,XCNQ,XTNX,XCYS,XCAI,XSTU,XBER,XHAN,XTAE,XAMM,XKAZ,XKUW,XCAS,XMUS,XKAR,DSMD,XMIC,RTSX,XSAU,XBRA,XCOL,XADS,XDFM,XCAR,XMSTAR,XOSE,XMEX`,{
            headers: {
                'Accept': 'application/json',
                // 'Origin' : 'https://www.wsj.com',
                'Accept-Encoding': 'gzip, deflate, br',
                'Host': 'services.dowjones.com',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Safari/605.1.15',
                'Accept-Language': 'en-gb',
                // 'Referer': 'https://www.wsj.com/',
                'Connection': 'keep-alive',
                // 'Access-Control-Allow-Origin':'http://localhost:3001'
            }
        })
    data = await response.json()
    // console.log(await Object.keys(data))
    res.send(await data.symbols)
    }
})

module.exports = router