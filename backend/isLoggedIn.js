const e = require("express")

function isLoggedIn(req,res,next){
    
    if (req.signedCookies.user){
        next()
    }else{
        res.json(JSON.stringify(false))
    }
}

module.exports = isLoggedIn