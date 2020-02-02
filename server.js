const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')

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


if (process.env.NODE_ENV ==='production'){
    
    app.use(express.static('client/build'))
    app.get('*',(req,res)=>{
        // res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
        console.log(`Youre in production \n File path: ${path.join(__dirname+'/client/build/index.html')}`)
  
        res.sendFile(path.join(__dirname+'/client/build/index.html'))

    })
}
port = process.env.PORT || 3001
app.listen(port, (res) => {
    
    console.log(`connected on port ${port}`)
})