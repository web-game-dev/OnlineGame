const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('config');
const auth = require('./routes/auth');
const passportSetup = require('./oauthStrategy/passport-google-strategy');

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

const db = config.get('db');
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log(`connected to MongoDB...`)})
  .catch((err) => console.log('Could not connect to mongodb', err));

app.listen(port, () => {
  console.log(`Connected to port ${port}.`);
});

app.use('/auth', auth);