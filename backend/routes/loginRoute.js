const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const userHandler = require('../database/userAccountHandler')
const {isLoggedIn} = require('../isLoggedIn')
const { pool } = require('../database/pool')


const validateEmail = (email) => {
    const validEmail = typeof email.trim() == 'string'
        // && email.search('@') != -1 
        && email.search(/\./) != -1
        && email.search(' ') == -1
        && email.split('@').length == 2
    return validEmail
}

const validateUser = (user) => {
    const validUser = typeof user.trim() == 'string'
        && !user.match(/[!@|[€£:;><§}{~ `'"#\$%\?\^\&*\)\(+=._-]/g)
    return validUser
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
    res.json('hi')
})



router.post('/signup', async (req, res) => {
    try{
        if (validateEmail(req.body.email) && validatePassword(req.body.password) && validateUser(req.body.user)) {

            hashedPass = await hashPass(req.body.password)

            userHandler.addUser(req.body.user, hashedPass, req.body.email).then(result => res.json({ message: result }))


        } else if (validateEmail(req.body.email)) {
            res.json({
                message: 'Please enter a valid password',
                length: 'Greater than 6 chars',
                attributes: 'Must include letters and numbers'
            })
        } else {
            res.json({ message: 'Please enter a valid email' })
    }}catch(err){
        res.json({message:'Please enter all details'})
    }
})

router.post('/login', async (req, res) => {
    console.log(req.app.get('env'))
    userHandler.getUser(req.body.user, req.body.password)
        .then((data) => { 
            if (data.login) {
            res.cookie('user', data.userdata.id, {
                httpOnly:true,
                signed:true,
                secure: req.app.get('env') != 'development' 
            })
            res.json(data)
        }else{
            res.json(data)
        }

        })
        .catch(err => {
            console.log(err)
        })
        
})

router.get('/loggedIn', isLoggedIn, (req,res) => {  
   
    res.json(JSON.stringify(true)) 
})

module.exports = router