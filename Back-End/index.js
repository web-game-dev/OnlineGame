const express = require('express');
const cors = require('cors');
const auth = require('./routes/auth');

const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(port, () => {
  console.log(`Connected to port ${port}.`);
});

app.use('/auth', auth);