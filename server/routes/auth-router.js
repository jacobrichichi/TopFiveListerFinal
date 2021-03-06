const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth-controller')

router.post('/register', AuthController.registerUser)
router.post('/login', AuthController.loginUser)
router.post('/loginById/', AuthController.loginUserById)
//router.post('/guestStartUp/', AuthController.guestStartUp)
router.get('/loginGuest', AuthController.loginGuest)
router.get('/logout', AuthController.logoutUser)
router.get('/loggedIn', AuthController.getLoggedIn)

module.exports = router