const User = require('../models/User')

exports.home = function(req, res) {
    res.render('home-guest')
}

exports.about = function(req, res) {
    res.render('about')
}

exports.register = function(req, res) {
    let user = new User(req.body)
    user.register()
    if(user.errors.length) {
        res.send(user.errors)
    }else {
        res.send("Thanks for trying to register")
    }
}