require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const globalErrorHandler = require('../src/controllers/ErrorController');

const sync = require('./scripts/sync')

const app = express();
const port = process.env.PORT;

// logger
app.use(morgan('combined'));

const route = require('./routes');


// config data input/output
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Routes init
route(app);

//Global Error Handling Middleware
app.use(globalErrorHandler);

sync();


app.listen(port, () => {
  console.log(`app is running on  port ${port}`)
})