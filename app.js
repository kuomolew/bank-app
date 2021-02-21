const express = require('express');
const morgan = require('morgan');
const compression = require('compression');

const bankRouter = require('./routes/bankRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(compression());

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/banks', bankRouter);

module.exports = app;
