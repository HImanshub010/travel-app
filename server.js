const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express'); 
const swaggerDocument = require('./swagger.json');
const constants = require('./constants/constants')
const adminRoutes = require('./admin/routes')
const userRoutes = require('./user/routes')
const driverRoutes = require('./driver/routes')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Hello-world');
})

app.use('/admin', adminRoutes);
app.use('/users',userRoutes);
app.use('/driver',driverRoutes);


app.listen(3000, () => {
  constants.CONNECTION.connect((err) => {
    if (err) {
      console.log('error in connecting to mysql database');
      throw err;
    } else {
      console.log("Connected to mysql  server");
      console.log('Connected to server');
    }
  })
})
