const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const userRouter = require('./routes/userRoutes');

dotenv.config({
  path: './config.env'
});

const app = express();

app.use(morgan('combined'));
app.use(express.json());

const options = {
  useNewUrlParser: true,
  useCreateIndex: true
};

const uri = process.env.DATABASE.replace(
  /<password>/,
  process.env.DATABASE_PASSWORD
);

try {
  mongoose.connect(uri, options);
  console.log('Connected to Database');
} catch (err) {
  console.log('Failed connecting to Database');
}

app.use('/api/v1/users', userRouter);

module.exports = app;
