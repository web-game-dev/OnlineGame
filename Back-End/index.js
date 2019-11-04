const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('config');
const passport = require('passport');
const coookieSession = require('cookie-session');
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

app.use(coookieSession({
  maxAge: 86400000, // 24 hours in ms
  keys: [config.get('cookieKey')],
  name: 'dungeon_cookie',
}));

app.use(passport.initialize());
app.use(passport.session());

const db = config.get('db');
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log(`connected to MongoDB...`)})
  .catch((err) => console.log('Could not connect to mongodb', err));

app.listen(port, () => {
  console.log(`Connected to port ${port}.`);
});

app.use('/auth', auth);