const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const user = require('./routes/user');
const apartment = require('./routes/apartment');

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

module.exports = app;
