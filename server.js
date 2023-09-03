const express = require('express');
require('dotenv').config({path: './config/env/config.env'});

const app = express();
const PORT = process.env.PORT || 3000;


//To get req.body parameters from user
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Kubis Library Welcome Page"
  })
})

app.listen(PORT, () => {
  console.log(`App started on ${PORT} : ${process.env.NODE_ENV}`)
});