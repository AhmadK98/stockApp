const express = require('express')
const bodyParser = require('body-parser')

const stockRoute = require('./backend/routes/stockRoute')
const loginRoute = require('./backend/routes/loginRoute')
require('dotenv').config()


const app = express()
app.use(bodyParser.json())

app.use('/stocks', stockRoute)
app.use('/users', loginRoute)


app.get('/', (req, res) => {
    res.send('hiv')
})

port = process.env.PORT || 3001

app.listen(port, (res) => {
    console.log(`connected on port ${port}`)
})