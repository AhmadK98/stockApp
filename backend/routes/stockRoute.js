const express = require('express')
const router = express.Router()
const stockHandler = require('../database/stockHandler')

router.get('/:stock', (req, res) => {
    let includeTime = req.query.includeTime ? true : null
    stockHandler.getCurrentValue(req.params.stock, includeTime)
        .then(data => res.json(data))
        .catch(err => res.json('Could not retrieve data'))

})




module.exports = router