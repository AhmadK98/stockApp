const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const userHandler = require('../database/userAccountHandler')
const { pool } = require('../database/pool')

const validateEmail = (email) => {
    const validEmail = typeof email.trim() == 'string'
        // && email.search('@') != -1 
        && email.search(/\./) != -1
        && email.search(' ') == -1
        && email.split('@').length == 2
    return validEmail
}

const validatePassword = (password) => {
    const validPassword = typeof password.trim() == 'string'
        // && email.search('@') != -1 
        && /\d/.test(password)
        && password.search(' ') == -1
        && password.length >= 6
    return validPassword
}

const hashPass = async (password) => {
    const hashed = await bcrypt.hash(password, 10)
    return hashed
}


router.get('/', (req, res) => {
    res.send('hi')
})



router.post('/signup', async (req, res) => {
    if (validateEmail(req.body.email) && validatePassword(req.body.password)) {

        hashedPass = await hashPass(req.body.password)

        userHandler.addUser(req.body.username, hashedPass, req.body.email).then(result => res.json({ message: result }))


    } else if (validateEmail(req.body.email)) {
        res.json({
            message: 'Please enter a valid password',
            length: 'Greater than 6 chars',
            attributes: 'Must include letters and numbers'
        })
    } else {
        res.json({ message: 'Please enter a valid email' })
    }
})

router.post('/login', async (req, res) => {
    userHandler.getUser(null, req.body.email, req.body.password)
        .then((data) => res.json(data.login || data))
})
//login with details and credentials / cookies
// bcrypt.compare('asdadsaf4', '$2b$10$fUem5kCqmxu0cr1d3lqLj.3eMIiS47C5TR/bC2WN6/uqVxdazOrTq', function(err, res) {
//     console.log(res)
// })
module.exports = router