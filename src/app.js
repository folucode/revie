const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const user = require('./routes/user');
const apartment = require('./routes/apartment');
const reviews = require('./routes/reviews');

const app = express();

const corsOptions = {
  origin: 'http://localhost:8081',
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(user);
app.use(apartment);
app.use(reviews);

module.exports = app;
