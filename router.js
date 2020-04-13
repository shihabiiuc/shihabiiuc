const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')

router.get('/', userController.home)
router.get('/about', userController.about)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

router.get('/create-ticket', userController.mustBeLoggedIn, postController.viewCreateScreen)

module.exports = router