const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')
const followController = require('./controllers/followController')
const paymentController = require('./controllers/paymentController')

// General route
router.get('/', userController.home)
router.get('/about', userController.about)
router.get('/portfolio', userController.portfolio)
router.get('/services', userController.services)
router.get('/contact', userController.contact)
router.get('/success', userController.success)
router.get('/cancel', userController.cancel)
router.get('/privacy-policy', userController.privacy)
router.get('/refund-policy', userController.refund)
router.get('/subscribe-to-our-web-design-newsletter', userController.subscribe)
router.get('/thank-you-for-subscribing', userController.thankyou)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

// Profile related routes
router.get('/profile/:username', userController.ifUserExists, userController.sharedProfileData, userController.profilePostScreen)
router.get('/profile/:username/followers', userController.ifUserExists, userController.sharedProfileData, userController.profileFollowersScreen)
router.get('/profile/:username/following', userController.ifUserExists, userController.sharedProfileData, userController.profileFollowingScreen)

// Post related routes
router.get('/create-post', userController.mustBeLoggedIn, postController.viewCreateScreen)
router.post('/create-post', userController.mustBeLoggedIn, postController.create)
router.get('/post/:id', postController.viewSingle)
router.get('/post/:id/edit', userController.mustBeLoggedIn, postController.viewEditScreen)
router.post('/post/:id/edit', userController.mustBeLoggedIn, postController.edit)
router.post('/post/:id/delete', userController.mustBeLoggedIn, postController.delete)
router.post('/search', postController.search)

// Follow related routes
router.post('/addFollow/:username', userController.mustBeLoggedIn, followController.addFollow)
router.post('/removeFollow/:username', userController.mustBeLoggedIn, followController.removeFollow)

// Payment related routes
router.post('/payment', paymentController.payment)
router.get('/success', paymentController.success)
router.get('/cancel', paymentController.cancel)

module.exports = router