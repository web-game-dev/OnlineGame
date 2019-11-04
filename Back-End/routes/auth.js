const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const auth = require('../middleware/auth');
const { User, validateUser, validateUserLogin } = require('../models/user');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { error } = validateUserLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ "local.email": req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.local.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  const token = user.generateAuthToken();
  res.send(token);
});

// local registration
router.post('/register', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ "local.email": req.body.email });
  if (user) return res.status(400).send('Email exists');

  user = await User.findOne({ "google.email": req.body.email });
  if (user) return res.status(400).send('Email exists');


  user = new User({
    method: 'local',
    local: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
  });

  const salt = await bcrypt.genSalt(10);
  user.local.password = await bcrypt.hash(user.local.password, salt);

  const result = await user.save()
    .catch((err) => {
      res.status(500).send('Could not register user');
      console.log('err');
  });

  const token = user.generateAuthToken();
  res.send(token);
});

// If user wants to login with google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// this is handeled on the backend
router.get('/google/redirect', passport.authenticate('google', { session: false }), (req, res) => {
  const user = req.user;
  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;