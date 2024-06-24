require('dotenv').config();
const express = require('express');

const sync = require('./scripts/sync')

const app = express();
const port = process.env.PORT;

const route = require('./routes');


// config data input/output
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Routes init
route(app);


sync();


app.listen(port, () => {
  console.log(`app is running on  port ${port}`)
})