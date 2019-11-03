const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('../middleware/auth');

router.get('/login', (req, res) => {
  console.log('login');
});

// logs out users
router.get('/logout', (req, res) => {
  req.logout();
  res.send('logged out');
});

// If user wants to login with google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// this is handeled on the backend
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.send(req.user);
});

module.exports = router;