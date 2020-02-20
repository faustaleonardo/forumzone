const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config({
  path: './config.env'
});

const app = express();

app.use(morgan('combined'));

console.log(process.env);

app.post('/api/v1/signup', (req, res, next) => {
  res.json({
    status: 'success'
  });
});

module.exports = app;
