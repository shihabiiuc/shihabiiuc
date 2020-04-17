const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')

router.get('/', userController.home)
router.get('/about', userController.about)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

router.get('/profile/:username', userController.ifUserExists, userController.profilePostScreen)

router.get('/create-ticket', userController.mustBeLoggedIn, postController.viewCreateScreen)
router.post('/create-ticket', userController.mustBeLoggedIn, postController.create)
router.get('/post/:id', postController.viewSingle)
router.get('/post/:id/edit', userController.mustBeLoggedIn, postController.viewEditScreen)
router.post('/post/:id/edit', userController.mustBeLoggedIn, postController.edit)
router.post('/post/:id/delete', userController.mustBeLoggedIn, postController.delete)
router.post('/search', postController.search)

module.exports = router