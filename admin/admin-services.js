const Promise = require('bluebird');
const mongo = require('./../database/mongo-libs');
const mysql = require('../database/mysql-libs')

/**
   * @function <b> intializeAdmin </b> <br>
   * Service function for intializing the two admin if there are no admin.
   * @param 
   * @return {Object} result Promise object from sql upon successful completion
   */

const intializeAdmin = Promise.coroutine(function*(){
  let query = 'select admin_id from admin';
  try {
    let result = yield mysql.mysqlQuery(query , []);
    if(!result||!result[0]){
      let insertQuery= "INSERT INTO admin (admin_id, name, email,password) VALUES ('1', 'admin1', 'admin1@gmail.com','$2b$10$A00Re/T30fQQkLzfgZXyLOqls/ur363GD79vaYyVTetbt.SDp5/VW'),('2','admin2', 'admin2@gmail.com','$2b$10$Pz3zR0W/wZrHwVpQizgUqOwcM81FiCR0lRN0QwJQ0aZU2PyLuj7SC')";
      yield mysql.mysqlQuery(insertQuery , [])//,'admin2','admin2@gmail.com','admin2']);
      return Promise.resolve('Successfully inserted two admin');
    }else{
      return Promise.resolve('Welcome to the Travel - app');
    }
  } catch (error) {
    throw error;
  }
})


/**
   * @function <b> login </b> <br>
   * Service function for logging in a existing Admin
   * @param   name id 
   * @return {Object} result object from sql contains password (if successfull)
   */
const login = Promise.coroutine(function* (id) {
  let query = `select password from admin where admin_id = ?`;
  try {
    let result = yield mysql.mysqlQuery(query, [id])
    if (!result) {
      throw new Error('No matching element found');
    } else {
      return result
    }
  } catch (err) {
    throw err
  }
})

/**
   * @function <b> getAllUnassignedBooking </b> <br>
   * Service function for getting all unassigned Booking 
   * @param 
   * @return {Object} result object from sql contains unassigned booking (if successfull)
   */
const getAllUnassignedBooking = Promise.coroutine(function* (){
  let query = 'select booking_id from bookings where status = ?';
  try {
    let result = yield mysql.mysqlQuery(query, [0]);
    return result;
  } catch (error) {
    throw error
  }
})

/**
   * @function <b> getAvailableDriver </b> <br>
   * Service function for getting all available Driver
   * @param 
   * @return {Object} result object from sql contains available driver(if successfull)
   */
const getAvailableDriver = Promise.coroutine(function* (){
  let query = 'select driver_id from driver where status_available = ?';
  try {
    let result = yield mysql.mysqlQuery(query, [1]);
    return result;
  } catch (error) {
    throw error
  }
})

/**
   * @function <b> assignBooking </b> <br>
   * Service function for assigning Driver to pending booking
   * @param 
   * @return {Object} result object from sql contains available (if successfull)
   */
const assignBooking = Promise.coroutine(function* (adminId) {

  let driverAvailable = yield getAvailableDriver();
  if (!driverAvailable || !driverAvailable[0]) {
    throw new Error('Driver is not available');
  }
  let pendingBooking = yield getAllUnassignedBooking();
  if (!pendingBooking || !pendingBooking[0]) {
    throw new Error('All booking are assigned');
  }
  let query1 = 'update bookings set driver_id = ?,assigned_by_admin =?,status = ? where booking_id = ?';
  let query2 = 'update driver set status_available = ? where driver_id = ?'
  try {
    let results = yield mysql.mysqlQuery(query1, [driverAvailable[0].driver_id, adminId, 1, pendingBooking[0].booking_id]);
    let result1 = yield mysql.mysqlQuery(query2, [0, driverAvailable[0].driver_id]);
    mongo.insertDataInMongo("assigned",{
      admin_id:adminId,
      driver_id :driverAvailable[0].driver_id,
      booking_id :pendingBooking[0].booking_id,
      date : new Date()
    });
    return Promise.resolve('Sucessfully assigned a booking');
  } catch (error) {
    throw error
  }
})

/**
   * @function <b> getAllOngoingBooking </b> <br>
   * Service function for getting the ongoing booking
   * @param 
   * @return {Object} result object from sql contains ongoing booking (if successfull)
   */
const getAllOngoingBooking = async () => {
  let query = 'select bookings.booking_id, driver.driver_id,driver.name  from bookings inner Join driver on bookings.driver_id = driver.driver_id where bookings.status = 1';
  try {
    let result = await mysql.mysqlQuery(query, []);
    return result;
  } catch (error) {
    throw error
  }
}

/**
   * @function <b> bookingHistory </b> <br>
   * Service function for assigning Driver to pending booking
   * @param 
   * @return {Object} result object from sql contains available (if successfull)
   */
const bookingHistory = async (adminId) => {
  let query = 'select bookings.booking_id, driver.name as Driver from bookings left join driver on bookings.driver_id = driver.driver_id where bookings.assigned_by_admin = ?'
  try {
    let result = await mysql.mysqlQuery(query, [adminId]);
    return result;
  } catch (error) {
    throw error
  }
}

module.exports = {
  login,
  intializeAdmin,
  assignBooking,
  bookingHistory,
  getAvailableDriver,
  getAllOngoingBooking,
  getAllUnassignedBooking
}