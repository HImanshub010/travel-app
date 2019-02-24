const Promise = require('bluebird');
const bcrypt = require('bcrypt');

const services = require('./driver-services');
const constants = require('./../constants/constants')
const authentication = require('./../authentication/authentication')

const signup = Promise.coroutine(function* (req, res) {
  /**
   * @function <b> signup </b> <br>
   * Resgister a new driver
   * @param {Object}req
   * @return {Object} response object
   */
  let { name, password, phoneNumber, lat, long, licenceNumber, dob } = req.body;
  try {
    let salt = yield bcrypt.genSalt(constants.SALT_ROUNDS);
    let hashPassword = yield bcrypt.hash(password, salt);
    let result = yield services.signup(name, hashPassword, phoneNumber, lat, long, licenceNumber, dob);
    let token = yield authentication.generateToken({ id: result.insertId }, constants.DRIVER_SECRET_KEY);
    res.send({
      message: constants.responseMessages.SIGNUP_SUCCESSFUL,
      status: constants.responsestatus.SIGNUP_SUCCESSFUL,
      data: {
        id: result.insertId,
        token
      }
    });
  } catch (error) {
    res.send({
      message: constants.responseMessages.ERROR_OCCURED,
      status: constants.responsestatus.ERROR_OCCURED,
      data: null
    })
  }
})

const login = Promise.coroutine(function* (req, res) {
  /**
   * @function <b> login </b> <br>
   * Log in existing Driver
   * @param {Object}req
   * @return {Object} response object
   */
  let { id, password } = req.body;
  try {
    let result = yield services.login(id);
    let hashPassword = result[0].password;
    let result1 = yield bcrypt.compare(password, hashPassword);
    if (result1) {
      let token = yield authentication.generateToken({ id }, constants.DRIVER_SECRET_KEY);
      res.json({
        message: constants.responseMessages.LOGIN_SUCCESSFUL,
        status: constants.responsestatus.LOGIN_SUCCESSFUL,
        data: { token }
      })
    } else {
      res.send({
        message: constants.responseMessages.LOGIN_FAILED,
        status: constants.responsestatus.LOGIN_FAILED,
        data: null
      })
    }
  } catch (err) {
    res.send({
      message: constants.responseMessages.ERROR_OCCURED,
      status: constants.responsestatus.ERROR_OCCURED,
      data: null
    })
  }
});

const completeBooking = Promise.coroutine(function* (req, res) {
  /**
   * @function <b> completeBooking </b> <br>
   * completes the ongoing booking of logged in user
   * @param {Object}req
   * @return {Object} response object
   */
  let { id } = req.authorizedData;
  console.log(id);
  try {
    let result = yield services.completeBooking(id);
    res.send({
      messsage: constants.responseMessages.SUCCESSFULLY_FETCHED,
      status: constants.responsestatus.SUCCESSFULLY_FETCHED,
      data: result
    })
  } catch (error) {
    res.send({
      message: constants.responseMessages.ERROR_OCCURED,
      status: constants.responsestatus.ERROR_OCCURED,
      data: null
    })
  }
})

const ongoingBooking = Promise.coroutine(function* (req, res) {
  /**
   * @function <b> ongoingBooking </b> <br>
   * List all the ongoing Booking of logged in driver
   * @param {Object}req
   * @return {Object} response object
   */
  let { id } = req.authorizedData;
  console.log(id);
  try {
    let result = yield services.ongoingBooking(id);
    console.log(result);
    res.send({
      messsage: constants.responseMessages.SUCCESSFULLY_FETCHED,
      status: constants.responsestatus.SUCCESSFULLY_FETCHED,
      data: result
    })
  } catch (error) {
    res.send({
      message: constants.responseMessages.ERROR_OCCURED,
      status: constants.responsestatus.ERROR_OCCURED,
      data: null
    })
  }
})

const bookingHistory = Promise.coroutine(function* (req, res) {
  /**
   * @function <b> bookingHistory </b> <br>
   * List all the booking history of logged in Driver
   * @param {Object}req
   * @return {Object} response object
   */
  let { id } = req.authorizedData;
  console.log(id);
  try {
    let result = yield services.bookingHistory(id);
    console.log(result);
    res.send({
      messsage: constants.responseMessages.SUCCESSFULLY_FETCHED,
      status: constants.responsestatus.SUCCESSFULLY_FETCHED,
      data: result
    })
  } catch (error) {
    console.log(error);
    res.send({
      message: constants.responseMessages.ERROR_OCCURED,
      status: constants.responsestatus.ERROR_OCCURED,
      data: null
    })
  }
})

module.exports = {
  login,
  signup,
  completeBooking,
  ongoingBooking,
  bookingHistory
}
