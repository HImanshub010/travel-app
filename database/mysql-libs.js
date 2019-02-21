const constants = require('../constants/constants')

const mysqlQuery = (query, param=[]) => {
  return new Promise((resolve, reject) => {     
    constants.CONNECTION.query(query, param, (err, result) => { 
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

module.exports = {
  mysqlQuery
}