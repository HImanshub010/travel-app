const Joi = require('joi');
const constants = require('./../constants/constants')

function validateSignup(req, res, next) {
  Joi.validate(req.body, constants.DRIVER_SIGNUP_SCHEMA, function (err, value) {
    if (err) {
      res.json({
        message: constants.responseMessages.FIELD_MISSING,
        status: constants.responsestatus.FIELD_MISSING,
        data: err.details[0].message,
      });
    } else {
      next();
    }
  });
}

function validateLogin(req, res, next) {
  Joi.validate(req.body, constants.LOGIN_SCHEMA, function (err, value) {
    if (err) {
      res.json({
        message: constants.responseMessages.FIELD_MISSING,
        status: constants.responsestatus.FIELD_MISSING,
        data: err.details[0].message,
      });
    } else {
      next();
    }
  });
}

module.exports = {
  validateSignup,
  validateLogin
}