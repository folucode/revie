const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const user = require('./routes/user');
const apartment = require('./routes/apartment');
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(user);
app.use(apartment);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
