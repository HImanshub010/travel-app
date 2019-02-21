const express = require('express')

let router = express.Router();

const driverController = require('./driver-controller')
const driverValidation = require('./driver-validation')
const authentication = require('./../authentication/authentication')

router.post('/signup', driverValidation.validateSignup, driverController.signup);

router.post('/login', driverValidation.validateLogin, driverController.login);

router.post('/completeBooking', authentication.checkTokenForDriver, driverController.completeBooking)

router.get('/ongoingBooking', authentication.checkTokenForDriver, driverController.ongoingBooking)

router.get('/bookingHistory', authentication.checkTokenForDriver, driverController.bookingHistory)

module.exports = router;










