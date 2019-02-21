const express = require('express')
let router = express.Router();

let adminController = require('./admin-controller')
let adminValidator = require('./admin-validation')
let authentication = require('./../authentication/authentication')

router.post('/login', adminValidator.validateLogin, adminController.login);

router.get('/getAllUnassignedBooking', authentication.checkTokenForAdmin, adminController.getAllUnassignedBooking);

router.get('/getAvailableDriver', authentication.checkTokenForAdmin, adminController.getAvailableDriver);

router.post('/assignBooking', authentication.checkTokenForAdmin, adminController.assignBooking);

router.get('/getAllOngoingBooking', authentication.checkTokenForAdmin, adminController.getAllOngoingBooking);

router.get('/bookingHistory', authentication.checkTokenForAdmin, adminController.bookingHistory)

module.exports = router;
