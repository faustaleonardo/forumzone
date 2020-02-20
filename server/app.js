const app = require('./server');

app.get('/', (req, res, next) => {
  res.end('hello');
});
