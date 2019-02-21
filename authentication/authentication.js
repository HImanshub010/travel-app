const jwt = require('jsonwebtoken');
const constants = require('./../constants/constants.js')
const resposeObject = {
  messsage: constants.responseMessages.NOT_LOGGED_IN,
  status: constants.responsestatus.NOT_LOGGED_IN,
  data: null
}

const generateToken = async (obj, secretKey) => {
  try {
    let token = await jwt.sign(obj, secretKey)
    return (token);
  } catch (err) {
    throw err;
  }
}

const checkTokenForUser = (req, res, next) => {
  const token = req.headers.token;
  if (typeof token !== 'undefined') {
    jwt.verify(token, constants.USER_SECRET_KEY, (err, authorizedData) => {
      if (err) {
        res.send(resposeObject);
      } else {
        req.authorizedData = authorizedData;
        next();
      }
    });
  } else {
    res.send(resposeObject);
  }
}

const checkTokenForDriver = (req, res, next) => {
  const token = req.headers.token;
  if (typeof token !== 'undefined') {
    jwt.verify(token, constants.DRIVER_SECRET_KEY, (err, authorizedData) => {
      if (err) {
        res.send(resposeObject);
      } else {
        req.authorizedData = authorizedData;
        next();
      }
    });
  } else {
    res.send(resposeObject);
  }
}

const checkTokenForAdmin = (req, res, next) => {
  const token = req.headers.token;
  if (typeof token !== 'undefined') {
    jwt.verify(token, constants.ADMIN_SECRET_KEY, (err, authorizedData) => {
      if (err) {
        res.send(resposeObject);
      } else {
        req.authorizedData = authorizedData;
        next();
      }
    });
  } else {
    res.send(resposeObject);
  }
}

module.exports = {
  generateToken,
  checkTokenForUser,
  checkTokenForAdmin,
  checkTokenForDriver
}