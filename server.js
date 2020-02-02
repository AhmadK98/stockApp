const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const stockRoute = require('./backend/routes/stockRoute')
const loginRoute = require('./backend/routes/loginRoute')
const isLoggedIn = require('./backend/isLoggedIn')

require('dotenv').config()


const app = express()
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(cors({
    credentials:true
}))


app.use('/stocks', stockRoute)
app.use('/users', loginRoute)


app.get('/', (req, res) => {
    res.send('hiv')
})

port = process.env.PORT || 3001

app.listen(port, (res) => {
    console.log(`connected on port ${port}`)
})