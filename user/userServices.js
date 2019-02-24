const mysql = require('../database/mysql-libs')
let mongo = require('./../database/mongo-libs'); 

/**
   * @function <b> signup </b> <br>
   * Service function for registering a new user
   * @param   name email password lat long dob phoneNumber
   * @return {Object} result object from sql
   */

const signup = async (name, email, password, lat, long, dob, phoneNumber) => {
  let query = `insert into user (name,email,password,date_of_birth,current_latitude,current_longitude,phone_number) values (?,?,?,?,?,?,?)`;
  try {
    let result = await mysql.mysqlQuery(query, [name, email, password, dob, lat, long, phoneNumber]);
    return (result);
  } catch (err) {
    throw err;
  }
}

/**
   * @function <b> login </b> <br>
   * Service function for logging in a existing User
   * @param   name id 
   * @return {Object} result object from sql contains password (if successfull)
   */

const login = async (id) => {
  let query = `select password from user where user_id = ?`;
  try {
    let result = await mysql.mysqlQuery(query, [id])
    if(!result){
      throw new Error('No matching element found');
    }else{
      return result
    }
  } catch (err) {
    throw err
  }
}

/**
   * @function <b> createBooking </b> <br>
   * Service function for creating a booking for logged in User
   * @param   name id 
   * @return {Object} result object from sql contains password (if successfull)
   */

const createBooking = async(id,pickupLat,pickupLong,dropLat,dropLong)=>{
  let query = `insert into bookings (user_id,pickup_latitude,pickup_longitude,drop_latitude,drop_longitude) values (?,?,?,?,?)`
  try {
    let result = await mysql.mysqlQuery(query,[id,pickupLat,pickupLong,dropLat,dropLong])
    mongo.insertDataInMongo("created",{
      booking_id:result.insertId,
      user_id:id,
      date : new Date()
    })
    return result;
  } catch (err) {
    throw err
  }
}

const bookingHistory = async(userId)=>{
let query = `SELECT user.name AS 'USER NAME' ,user.user_id,driver.driver_id,driver.name AS 'Driver Name' ,bookings.booking_id FROM user inner JOIN bookings ON user.user_id = bookings.user_id INNER JOIN driver on bookings.driver_id = driver.driver_id where bookings.status = 2 AND user.user_id= ?;`
  try {
    let result = await mysql.mysqlQuery(query, [userId])
    if(!result){
      throw new Error('No matching element found');
    }else{
      return result
    }
  } catch (err) {
    throw err
  }
}
module.exports = {
  signup,
  login,
  createBooking,
  bookingHistory
}