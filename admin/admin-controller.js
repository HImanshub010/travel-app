const Promise = require('bluebird');
const bcrypt = require('bcrypt');

const services = require('./admin-services');
const constants = require('./../constants/constants')
const authentication = require('./../authentication/authentication')

const login = Promise.coroutine(function* (req, res) {
  /**
   * @function <b> login </b> <br>
   * Log in an existing Admin
   * @param {Object}req
   * @return {Object} response object
   */
  let { id, password } = req.body;
  try {
    let result = yield services.login(id);
    let hashPassword = result[0].password;
    let result1 = yield bcrypt.compare(password, hashPassword);
    if (result1) {
      let token = yield authentication.generateToken({ id },constants.ADMIN_SECRET_KEY);
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
    console.log('>>>>>>>>>>>>>>>  ' + err);
    res.send({
      message: constants.responseMessages.ERROR_OCCURED,
      status: constants.responsestatus.ERROR_OCCURED,
      data: null
    })
  }
});

const assignBooking = Promise.coroutine(function* (req, res) {
  /**
   * @function <b> assignBooking </b> <br>
   * Assign a booking to the available driver and pending Booking
   * @param {Object}req
   * @return {Object} response object
   */
    let {id} = req.authorizedData;
    try {
      let result = yield services.assignBooking(id);
      res.send({
        message: constants.responseMessages.SUCCESSFULLY_FETCHED,
        status: constants.responsestatus.SUCCESSFULLY_FETCHED,
        data: result
      });
    } catch (error) {
      res.send({
        message: constants.responseMessages.ERROR_OCCURED,
        status: constants.responsestatus.ERROR_OCCURED,
        data: error.message
      })
    }
})

const getAllUnassignedBooking = Promise.coroutine(function* (req, res) {
  /**
   * @function <b> getAllUnassignedBooking </b> <br>
   * List all the unassigned booking 
   * @param {Object}req
   * @return {Object} response object
   */
  try {
    let result = yield services.getAllUnassignedBooking();
    res.send({
      message: constants.responseMessages.SUCCESSFULLY_FETCHED,
      status: constants.responsestatus.SUCCESSFULLY_FETCHED,
      data: result
    });
  } catch (error) {
    res.send({
      message: constants.responseMessages.ERROR_OCCURED,
      status: constants.responsestatus.ERROR_OCCURED,
      data: null
    })
  }
})

const getAvailableDriver = Promise.coroutine(function* (req, res) {
  /**
   * @function <b> getAvailableDriver </b> <br>
   * list all the available driver
   * @param {Object}req
   * @return {Object} response object
   */
  try {
    let result = yield services.getAvailableDriver();
    res.send({
      message: constants.responseMessages.SUCCESSFULLY_FETCHED,
      status: constants.responsestatus.SUCCESSFULLY_FETCHED,
      data: result
    });
  } catch (error) {
    console.log('>>>>>>>>>>>>>' + error);
    res.send({
      message: constants.responseMessages.ERROR_OCCURED,
      status: constants.responsestatus.ERROR_OCCURED,
      data: error.message
    })
  }
});


const getAllOngoingBooking = Promise.coroutine(function* (req,res){
  /**
   * @function <b> getAvailableDriver </b> <br>
   * list all the ongoing booking
   * @param {Object}req
   * @return {Object} response object
   */
  try {
    let result = yield services.getAllOngoingBooking();
    res.send({
      message: constants.responseMessages.SUCCESSFULLY_FETCHED,
      status: constants.responsestatus.SUCCESSFULLY_FETCHED,
      data: result
    });
  } catch (error) {
    console.log('>>>>>>>>>>>>>' + error);
    res.send({
      message: constants.responseMessages.ERROR_OCCURED,
      status: constants.responsestatus.ERROR_OCCURED,
      data: null
    })
  }
})

const bookingHistory = Promise.coroutine(function* (req,res){
  /**
   * @function <b> bookingHistory </b> <br>
   * List all the booking assigned by logged in Admin
   * @param {Object}req
   * @return {Object} response object
   */
  let  { id } = req.authorizedData;
  try {
    let result = yield services.bookingHistory(id);
    res.send({
      message: constants.responseMessages.SUCCESSFULLY_FETCHED,
      status: constants.responsestatus.SUCCESSFULLY_FETCHED,
      data: result
    });
  } catch (error) {
    console.log('>>>>>>>>>>>>>' + error);
    res.send({
      message: constants.responseMessages.ERROR_OCCURED,
      status: constants.responsestatus.ERROR_OCCURED,
      data: null
    })
  }
})

module.exports = {
  login,
  assignBooking,
  bookingHistory,
  getAvailableDriver,
  getAllOngoingBooking,
  getAllUnassignedBooking
}