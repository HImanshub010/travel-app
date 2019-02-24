let services = require('./userServices');
let constants = require('./../constants/constants')
let bcrypt = require('bcrypt');
let authentication = require('./../authentication/authentication')
let Promise  = require('bluebird')

const signup = Promise.coroutine(function* (req, res){
  /**
   * @function <b> signup </b> <br>
   * Resgister a new user
   * @param {Object}req
   * @return {Object} response object
   */
  let { name, email, password, lat, long, dob, phoneNumber } = req.body;
  try {
    let salt = yield bcrypt.genSalt(constants.SALT_ROUNDS);
    let hashPassword = yield bcrypt.hash(password, salt);
    let result = yield services.signup(name, email, hashPassword, lat, long, dob, phoneNumber);
    let token = yield authentication.generateToken({ id: result.insertId },constants.USER_SECRET_KEY);
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

const login = Promise.coroutine(function* (req, res){
  /**
   * @function <b> login </b> <br>
   * For login a user
   * @param {Object}req
   * @return {Object} response object
   */
  let { id, password } = req.body;
  try {
    let result = yield services.login(id);
    let hashPassword = result[0].password;
    let result1 = yield bcrypt.compare(password, hashPassword);
    if (result1) {
      let token = yield authentication.generateToken({id},constants.USER_SECRET_KEY);
      res.json({
        message: constants.responseMessages.LOGIN_SUCCESSFUL,
        status: constants.responsestatus.LOGIN_SUCCESSFUL,
        data: { token }
      })
    }else{
      res.send({
        message : constants.responseMessages.LOGIN_FAILED,
        status  : constants.responsestatus.LOGIN_FAILED,
        data : null 
      })
    }
  } catch (err) {
    res.send({
      message: constants.responseMessages.ERROR_OCCURED,
      status: constants.responsestatus.ERROR_OCCURED,
      data: null
    })
  }
})

const createBooking = Promise.coroutine(function*(req,res){
  /**
   * @function <b> createBooking </b> <br>
   * Creates a new booking for logged in user
   * @param {Object}req
   * @return {Object} response object
   */
  let{ id } = req.authorizedData;
  let { pickupLat,pickupLong,dropLat,dropLong }=req.body;
  try {
    let result = yield services.createBooking(id,pickupLat,pickupLong,dropLat,dropLong);
    res.send({
      message: constants.responseMessages.BOOKING_SUCCESSFUL,
      status: constants.responsestatus.BOOKING_SUCCESSFUL,
      data: {
        bookingId : result.insertId
      }
    }) 
  } catch (error) {
   res.send({
    message: constants.responseMessages.ERROR_OCCURED,
    status: constants.responsestatus.ERROR_OCCURED,
    data: null
   }) 
  }
})

const bookingHistory = Promise.coroutine(function*(req,res){
  /**
   * @function <b> booking History </b> <br>
   * List all the booking made by user
   * @param {Object}req
   * @return {Object} response object
   */
  let{ id } = req.authorizedData;
  try {
    let result = yield services.bookingHistory(id);
    res.send({
      message: constants.responseMessages.SUCCESSFULLY_FETCHED,
      status: constants.responsestatus.SUCCESSFULLY_FETCHED,
      data: {
        result
      }
    }) 
  } catch (error) {
   res.send({
    message: constants.responseMessages.ERROR_OCCURED,
    status: constants.responsestatus.ERROR_OCCURED,
    data: null
   }) 
  }
})

module.exports = {
  signup,
  login,
  createBooking,
  bookingHistory
}