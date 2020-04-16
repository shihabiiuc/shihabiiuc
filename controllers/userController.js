const User = require('../models/User')
const Post = require('../models/Post')


exports.register = function(req, res) {
    let user = new User(req.body)
    user.register().then(() => {
        req.session.user = {username: user.data.username, avatar: user.avatar, _id: user.data._id}
        req.session.save(function() {
            res.redirect('/')
        })          
    }).catch((regErrors) => {
        regErrors.forEach(function(err) {
            req.flash('regErrors', err)
        })
        req.session.save(function() {
            res.redirect('/')
        })
    })
    
}

exports.mustBeLoggedIn = function(req, res, next) {
    if(req.session.user) {
        next()
    }else {
        req.flash("errors", "You must be logged in to perform the action")
        req.session.save(function() {
            res.redirect('/')
        })
    }
}

exports.login = function(req, res) {
    let user = new User(req.body)
    user.login().then(function(x) {
        req.session.user = {avatar: user.avatar, username: user.data.username, _id: user.data._id}
        req.session.save(function() {
            res.redirect('/')
        })
    }).catch(function(y) {
        req.flash('errors', y)
        req.session.save(function() {
            res.redirect('/')
        })        
    })
}

exports.logout = function(req, res) {
    req.session.destroy(function() {
        res.redirect('/')
    })
}

exports.home = function(req, res) {
    if(req.session.user) {
        res.render('home-dashboard')         
    }else {
        res.render('home-guest', {regErrors: req.flash('regErrors')})
    }
}

exports.about = function(req, res) {
    res.render('about')
}

exports.ifUserExists = function (req, res, next) {
    User.findByUsername(req.params.username).then(function (userDocument) {
        req.profileUser = userDocument
        next()
    }).catch(function () {
        res.render('404')
    })
}
exports.profilePostScreen = function (req, res) {
    // Ask our post model for posts by certain post id
    Post.findByAuthorId(req.profileUser._id).then(function (posts) {
        res.render('profile', {
            posts: posts,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar
        })
    }).catch(function () {
        res.render('404')
    })


}