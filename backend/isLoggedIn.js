const express = require("express")
require('dotenv').config()


function isLoggedIn(req, res, next) {

    if (req.signedCookies.user) {
        next()
    } else {
        res.json(JSON.stringify(false))
    }
}

function isAuth(req, res, next) {

    if (process.env.COOKIE_SECRET) {
        next()
    } else {
        res.json(JSON.stringify(false))
    }
}

module.exports.isLoggedIn = isLoggedIn
module.exports.isAuth = isAuth