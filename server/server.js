const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
