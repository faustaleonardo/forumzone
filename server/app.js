const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const userRouter = require('./routes/userRoutes');

/** ENVIRONMENT VARIABLE */
dotenv.config({
  path: './config.env'
});
/** END: ENVIRONMENT VARIABLE */

const app = express();

/** MIDDLEWARE */
app.use(morgan('combined'));
app.use(express.json());
/** END: MIDDLEWARE */

/** DATABASE */
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
/** END: DATABASE */

/** API */
app.use('/api/v1/users', userRouter);
/** END: API */

module.exports = app;
