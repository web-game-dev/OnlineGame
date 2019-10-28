const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const config = require('config');

if(!config.get('clientID')) {
  console.log('FATAL CLIENTID IS MISSINg');
  process.exit(1);
}

if(!config.get('clientSecret')) {
  console.log('FATAL CLIENTSECRET IS MISSING');
  process.exit(1);
}

passport.use(new GoogleStrategy({
  callbackURL: '/auth/google/redirect',
  clientID: config.get('clientID'),
  clientSecret: config.get('clientSecret'),
}, () => {
  // callback
}));