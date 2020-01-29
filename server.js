const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.get('/api', (req, res) => {
    const customer = { message: 'hi' }
    res.json(customer)
})

const port = 3001

app.listen(port, () => console.log(`Server started on ${port}`))
