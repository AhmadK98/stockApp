const express = require('express')
const router = express.Router()
const stockHandler = require('../database/stockHandler')

router.get('/', (req, res) => {
    stockHandler.getCurrentValue('tsla').then(data => res.json(data))
})



module.exports = router