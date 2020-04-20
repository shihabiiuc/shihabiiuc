const User = require('../models/User')
const Post = require('../models/Post')
const Follow = require('../models/Follow')

exports.sharedProfileData = async function (req, res, next) {
    let isVisitorsProfile = false
    let isFollowing = false
    if (req.session.user) {
        isVisitorsProfile = req.profileUser._id.equals(req.session.user._id)
        isFollowing = await Follow.isVisitorFollowing(req.profileUser._id, req.visitorId)
    }
    req.isVisitorsProfile = isVisitorsProfile
    req.isFolloing = isFollowing

    //count posts, followers, following
    let postCountPromise = Post.countPostsByAuthor(req.profileUser._id)
    let followerCountPromise = Follow.countFollowersById(req.profileUser._id)
    let followingCountPromise = Follow.countFollowingById(req.profileUser._id)
    let [postCount, followerCount, followingCount] = await Promise.all([postCountPromise, followerCountPromise, followingCountPromise])
    req.postCount = postCount
    req.followerCount = followerCount
    req.followingCount = followingCount

    next()
}

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

exports.home = async function(req, res) {
    if(req.session.user) {
        // Lets feed post from current user
        let posts = await Post.getFeed(req.session.user._id)

        res.render('home-dashboard', {posts: posts})
    }else {
        res.render('home-guest', {regErrors: req.flash('regErrors')})
    }
}

exports.about = function(req, res) {
    res.render('about')
}
exports.portfolio = function (req, res) {
    res.render('portfolio')
}
exports.services = function (req, res) {
    res.render('services')
}
exports.contact = function (req, res) {
    res.render('contact')
}
exports.success = function (req, res) {
    res.render('success-payment')
}
exports.cancel = function (req, res) {
    res.render('cancel-payment')
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
            currentPage: "posts",
            posts: posts,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            isFollowing: req.isFolloing,
            isVisitorsProfile: req.isVisitorsProfile,
            counts: {postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount}
        })
    }).catch(function () {
        res.render('404')
    })
}

exports.profileFollowersScreen = async function (req, res) {
    try {
        let followers = await Follow.getFollowersById(req.profileUser._id)
        res.render('profile-followers', {
            currentPage: "followers",
            followers: followers,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            isFollowing: req.isFolloing,
            isVisitorsProfile: req.isVisitorsProfile,
            counts: {postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount}
        })
    } catch {
        res.render('404')
    }
}
exports.profileFollowingScreen = async function (req, res) {
    try {
        let following = await Follow.getFollowingById(req.profileUser._id)
        res.render('profile-following', {
            currentPage: "following",
            following: following,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar,
            isFollowing: req.isFolloing,
            isVisitorsProfile: req.isVisitorsProfile,
            counts: {postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount}
        })
    } catch {
        res.render('404')
    }
}