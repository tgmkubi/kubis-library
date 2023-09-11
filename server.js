const express = require('express');
require('dotenv').config({path: './config/env/config.env'});

const app = express();
const PORT = process.env.PORT || 3000;

//MongoDb Connection
const connectDatabase = require('./helpers/database/connectDatabase');
connectDatabase();

//To get req.body parameters from user
app.use(express.json());

const routers = require('./routers/index');
app.use('/api', routers);

// Express Custom Error Handler Middleware
const customErrorHandler = require('./middlewares/errors/customErrorHandler');
app.use(customErrorHandler);

//Express Static Files
const path = require('path');
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`App started on ${PORT} : ${process.env.NODE_ENV}`)
});