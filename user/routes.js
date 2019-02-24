const express = require('express')
let router = express.Router();

const authentication = require('./../authentication/authentication')
const userController = require('./userController');
const userValidation = require('./userValidation'); 

router.post('/signup',userValidation.validateSignup,userController.signup);

router.post('/login', userValidation.validateLogin,userController.login);

router.post('/createBooking',authentication.checkTokenForUser,userController.createBooking);

router.get('/bookingHistory',authentication.checkTokenForUser,userController.bookingHistory);
module.exports = router;
