const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const { User, validateUser} = require('../models/user');
const router = express.Router();

router.get('/login', (req, res) => {
  console.log('login');
});

// local registration
router.post('/register', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send('Invalid email or password');

  let user = await User.findOne({ "local.email": req.body.email });
  if (user) return res.status(400).send('Email exists');

  user = await User.findOne({ "google.email": req.body.email });
  if (user) return res.status(400).send('Email exists');


  user = new User({
    method: 'local',
    local: {
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

  res.cookie('dungeon_cookie', result, {
    maxAge:86400000
  });
});

// If user wants to login with google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/test', auth, (req, res) => {
  res.send('logged in');
});

// this is handeled on the backend
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.send(req.user);
});

// logs out users
router.get('/logout', (req, res) => {
  req.logout();
  res.send('logged out');
});


module.exports = router;