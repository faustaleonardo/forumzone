const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const userRouter = require('./routes/userRoutes');
const questionRouter = require('./routes/questionRoutes');
const commentRouter = require('./routes/commentRoutes');

const errorController = require('./controllers/errorController');

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

mongoose
  .connect(uri, options)
  .then(() => {
    console.log('Connected to Database');
  })
  .catch(err => {
    console.log('Failed connecting to Database', err);
  });

app.use('/api/v1/users', userRouter);
app.use('/api/v1/questions', questionRouter);
app.use('/api/v1/comments', commentRouter);

app.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: 'Route does not exist.'
  });
});
// global error controller
app.use(errorController);

module.exports = app;
