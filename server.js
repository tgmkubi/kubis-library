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

app.listen(PORT, () => {
  console.log(`App started on ${PORT} : ${process.env.NODE_ENV}`)
});