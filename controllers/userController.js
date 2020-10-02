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

exports.register = function (req, res) {
    let user = new User(req.body)
    user.register().then(() => {
        req.session.user = { username: user.data.username, avatar: user.avatar, _id: user.data._id }
        req.session.save(function () {
            res.redirect('/')
        })
    }).catch((regErrors) => {
        regErrors.forEach(function (err) {
            req.flash('regErrors', err)
        })
        req.session.save(function () {
            res.redirect('/')
        })
    })

}

exports.mustBeLoggedIn = function (req, res, next) {
    if (req.session.user) {
        next()
    } else {
        req.flash("errors", "You must be logged in to perform the action")
        req.session.save(function () {
            res.redirect('/')
        })
    }
}

exports.login = function (req, res) {
    let user = new User(req.body)
    user.login().then(function (x) {
        req.session.user = { avatar: user.avatar, username: user.data.username, _id: user.data._id }
        req.session.save(function () {
            res.redirect('/')
        })
    }).catch(function (y) {
        req.flash('errors', y)
        req.session.save(function () {
            res.redirect('/')
        })
    })
}

exports.logout = function (req, res) {
    req.session.destroy(function () {
        res.redirect('/')
    })
}

exports.home = async function (req, res) {
    res.locals.metaTags = {
        title: "Web Designer & Developer: builds stunning online presence",
        description: "Providing web design & development service around the globe, created large number of websites which helped business owners to boost their reputation.",
        keywords: "web designer, web developer"
    }
    if (req.session.user) {
        // Lets feed post from current user
        let posts = await Post.getFeed(req.session.user._id)

        res.render('home-dashboard', { posts: posts, metatags: res.locals.metaTags })
    } else {
        res.render('home-guest', { regErrors: req.flash('regErrors'), metatags: res.locals.metaTags })
    }
}
exports.showOfferPage = function (req, res) {
    res.locals.metaTags = {
        title: "Quality Web Development with Affordable Price",
        description: "International Workers Day Offer! Quality web design & development at reduced/affordable price.",
        keywords: "international workers day, offer, may"
    }
    res.render('international-workers-day-offer', { metatags: res.locals.metaTags })
}
exports.about = function (req, res) {
    res.locals.metaTags = {
        title: "About web design & development skill, my work process",
        description: "Build wordpress websites, worked with popular wordpress themes, plugins & page builder: divi, flatsome, woodmart, acf, woocommerce.",
        keywords: "wordpress, developer"
    }
    res.render('about', { metatags: res.locals.metaTags })
}
exports.portfolio = function (req, res) {
    res.locals.metaTags = {
        title: "Web development portfolio, work samples of WordPress & more",
        description: "My web design & development portfolio, past work samples with live website URLs.",
        keywords: "portfolio, website"
    }
    res.render('portfolio', { metatags: res.locals.metaTags })
}
exports.pricing = function (req, res) {
    res.locals.metaTags = {
        title: "Website design & development services and offer",
        description: "Order & make payment for designing & developing your website. Mobile responsive design, highly secured, spam protected, easy to navigate website.",
        keywords: "hire, web developer"
    }
    res.render('pricing', { metatags: res.locals.metaTags })
}
exports.contact = function (req, res) {
    res.locals.metaTags = {
        title: "Contact me to design & develop your website, fix error & bug",
        description: "Contact me if you have any questions about my web design & development skills, process or work, or if you want to hire a web developer.",
        keywords: "contact, hire"
    }
    res.render('contact', { metatags: res.locals.metaTags })
}
exports.faq = function (req, res) {
    res.locals.metaTags = {
        title: "Frequently asked questions about website design pricing",
        description: "Frequently asked questions regarding website designing & developing pricing and the answers of the questions.",
        keywords: "faq, question"
    }
    res.render('faq', { metatags: res.locals.metaTags })
}
exports.salon = function (req, res) {
    res.locals.metaTags = {
        title: "Barber Hair Salon Website Design and Development",
        description: "Website design and development for Hair Salons & Barbers, FREE Domain and Hosting included in this website development package. Everything will cost $50 only, contact us to get yours!",
        keywords: "Hair, Salon, Barber"
    }
    res.render('barber-hair-salon', { metatags: res.locals.metaTags })
}
exports.cleaning_company = function (req, res) {
    res.locals.metaTags = {
        title: "Website designer and web developer for your cleaning company.",
        description: "Build a responsive and search engine optimized website for your cleaning company and get more clients for your cleaning business.",
        keywords: "web designer, web developer, website designer, cleaning company website"
    }
    res.render('cleaning-company', { metatags: res.locals.metaTags })
}
exports.success = function (req, res) {
    res.locals.metaTags = {
        title: "Order Received & Payment Received Successfully! -Shihabiiuc",
        description: "Your order & payment has been received successfully. We'll be in tourch with you shortly.",
        keywords: "order, payment"
    }
    res.render('success-payment', { metatags: res.locals.metaTags })
}
exports.cancel = function (req, res) {
    res.locals.metaTags = {
        title: "Order Cancelled | Shihabiiuc",
        description: "Your order has been cancelled and your account has not been charged.",
        keywords: "cancel, order"
    }
    res.render('cancel-payment', { metatags: res.locals.metaTags })
}
exports.privacy = function (req, res) {
    res.locals.metaTags = {
        title: "Privacy Policy | Shihabiiuc",
        description: "Privacy policy for our website Shihabiiuc.Com. This page describes which information we collect and how we use it.",
        keywords: "privacy policy"
    }
    res.render('privacy-policy', { metatags: res.locals.metaTags })
}
exports.refund = function (req, res) {
    res.locals.metaTags = {
        title: "Refund Policy | Shihabiiuc",
        description: "Refund policy for our website design & development services.",
        keywords: "refund policy"
    }
    res.render('refund-policy', { metatags: res.locals.metaTags })
}
exports.tos = function (req, res) {
    res.locals.metaTags = {
        title: "Terms and Conditions | Shihabiiuc",
        description: "Terms and conditions for our website design & development services.",
        keywords: "terms, conditions"
    }
    res.render('tos', { metatags: res.locals.metaTags })
}
exports.subscribe = function (req, res) {
    res.locals.metaTags = {
        title: "Subscribe to our web design newsletter",
        description: "Get our web design news, update, coupons, new services, our forum & blog articles, tutorials.",
        keywords: "newsletter, web design"
    }
    res.render('subscribe', { metatags: res.locals.metaTags })
}
exports.thankyou = function (req, res) {
    res.render('thank-you')
}
exports.resource = function (req, res) {
    res.locals.metaTags = {
        title: "Web development resource, questionnaire, forms & much more",
        description: "Your upcoming website will be solution to a problem. In order to design & develop a successful website, I really need to know the answers of  few questions. It’s a necessary evil but it’ll help me to ensure your return of investment in the web development project.",
        keywords: "web development questionnaire"
    }
    res.render('resource', { metatags: res.locals.metaTags })
}

exports.fiverr_feedback = function (req, res) {
    res.locals.metaTags = {
        title: "How to leave feedback or ratings after order has been completed automatically on Fiverr and send tip or bonus to seller",
        description: "Your orders are automatically completed after 72 hours of delivery, but still you have chance to leave feedback or ratings to seller and even you can send tips or bonus to seller.",
        keywords: "feedback, ratings, fiverr, bonus, tip"
    }
    res.render('fiverr-feedback', { metatags: res.locals.metaTags })
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
            counts: { postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount }
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
            counts: { postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount }
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
            counts: { postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount }
        })
    } catch {
        res.render('404')
    }
}