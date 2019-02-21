const mysql = require('../database/mysql-libs')
let mongo = require('./../database/mongo-libs');

const signup = async (name, password, phoneNumber, lat, long, licenceNumber, dob) => {
  let query = `insert into driver (name, password, phone_number,current_latitude, current_longitude, driver_licence_number,date_of_birth) values (?,?,?,?,?,?,?)`;
  try {
    let result = await mysql.mysqlQuery(query, [name, password, phoneNumber, lat, long, licenceNumber, dob]);
    return (result);
  } catch (err) {
    throw err;
  }
}

const login = async (id) => {
  let query = `select password from driver where driver_id = ?`;
  try {
    let result = await mysql.mysqlQuery(query, [id])
    if (!result) {
      throw new Error('No matching element found');
    } else {
      return result
    }
  } catch (err) {
    throw err
  }
}

const completeBooking = async (driverId) => {
  let query = 'update bookings set status = ? where status = ? and driver_id = ?';
  let query1 = 'update driver set status_available = ? where driver_id = ?';
  try {
    let result = await mysql.mysqlQuery(query, [2, 1, driverId]);
    let result1 = await mysql.mysqlQuery(query1, [1, driverId]);
    mongo.insertDataInMongo("compleated",{
      driver_id : driverId,
      date: new Date()
    })
    return result1;
  } catch (error) {
    throw error
  }
}

const bookingHistory = async(driverId)=>{
  let query = 'select booking_id,driver_id,user_id from bookings where status = ? and driver_id = ?'
  try {
    let result = await mysql.mysqlQuery(query, [2,driverId]);
    return result;
  } catch (error) {
    throw error
  }
}

const ongoingBooking = async(driverId)=>{
  let query  = 'select booking_id,driver_id,user_id from bookings where status = ? and driver_id = ?'
  try {
    let result = await mysql.mysqlQuery(query, [1,driverId]);
    return result;
  } catch (error) {
    throw error
  }
}

module.exports = {
  signup,
  login,
  completeBooking,
  bookingHistory,
  ongoingBooking
}