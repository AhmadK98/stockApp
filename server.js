const express = require('express')
const bodyParser = require('body-parser')
const stockRoute = require('./backend/routes/stockRoute')
require('dotenv').config()


const app = express()
app.use(bodyParser.json())

app.use('/stocks', stockRoute)


app.get('/', (req, res) => {
    res.send('hiv')
})

port = process.env.PORT || 3001

app.listen(port, (res) => {
    console.log(`connected on port ${port}`)
})