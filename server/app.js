const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRoutes');
const questionRouter = require('./routes/questionRoutes');
const commentRouter = require('./routes/commentRoutes');
const bookmarkRouter = require('./routes/bookmarkRoutes');
const voteRouter = require('./routes/voteRoutes');

const errorController = require('./controllers/errorController');

dotenv.config({
  path: './config.env'
});

const app = express();

app.use(cors());
app.options('*', cors());

app.enable('trust proxy');

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this ip address! Try again in an hour'
});
app.use('/api', limiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}

app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: ['age']
  })
);

app.use(cookieParser());

app.use(compression());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/questions', questionRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/bookmarks', bookmarkRouter);
app.use('/api/v1/votes', voteRouter);

app.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: 'Route does not exist.'
  });
});
// global error controller
app.use(errorController);

module.exports = app;
