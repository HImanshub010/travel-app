const mysql = require('mysql');
const Joi = require('joi');

const SALT_ROUNDS=10;
const USER_SECRET_KEY = "hello123";
const DRIVER_SECRET_KEY ='woowoo';
const ADMIN_SECRET_KEY = '23*%!@' 

let responseMessages = {
   SIGNUP_SUCCESSFUL: 'You have successfully signed up',
   FIELD_MISSING :' Some fields are missing or are inappropriate',
   ERROR_OCCURED  : 'An error occured while processing that request',
   LOGIN_SUCCESSFUL: 'You have successfully Logged in',
   LOGIN_FAILED : 'Login failed !!! ',
   BOOKING_SUCCESSFUL : 'Successfully placed booking',
   SUCCESSFULLY_FETCHED : 'Successfully fetched details',
   NOT_LOGGED_IN : 'You are not logged in'
}

let responsestatus = {
  SIGNUP_SUCCESSFUL : 200,
  FIELD_MISSING : 400,
  ERROR_OCCURED : 400,
  LOGIN_SUCCESSFUL : 200,
  LOGIN_FAILED  :401,
  BOOKING_SUCCESSFUL : 200,
  SUCCESSFULLY_FETCHED : 200,
  NOT_LOGGED_IN : 400
}

const CONNECTION = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'delivery',
}); 

const USER_SIGNUP_SCHEMA = Joi.object().keys({
  name: Joi.string().min(1).max(20).required(),
  email: Joi.string().trim().email({
    minDomainAtoms: 2
  }).max(20).required(),
  password: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(10).max(13).required(),
  dob: Joi.date().required(),
  lat: Joi.number().min(-90).max(90).required(),
  long: Joi.number().min(-180).max(180).required()
})

const LOGIN_SCHEMA = Joi.object().keys({
  id : Joi.number().required(),
  password : Joi.string().required()
});

const DRIVER_SIGNUP_SCHEMA = Joi.object().keys({
  name: Joi.string().min(1).max(20).required(),
  password: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(10).max(13).required(),
  dob: Joi.date().required(),
  lat: Joi.number().min(-90).max(90).required(),
  long: Joi.number().min(-180).max(180).required(),
  licenceNumber : Joi.string().max(15).min(15).required()
})

module.exports= {
  CONNECTION,
  responseMessages,
  responsestatus,
  USER_SIGNUP_SCHEMA,
  SALT_ROUNDS,
  USER_SECRET_KEY,
  DRIVER_SECRET_KEY,
  ADMIN_SECRET_KEY,
  LOGIN_SCHEMA,
  DRIVER_SIGNUP_SCHEMA
}