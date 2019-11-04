const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const config = require('config');
const { User } = require('../models/user');

if(!config.get('clientID')) {
  console.log('FATAL CLIENTID IS MISSINg');
  process.exit(1);
}

if(!config.get('clientSecret')) {
  console.log('FATAL CLIENTSECRET IS MISSING');
  process.exit(1);
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = User.findById(id);
  if (!user) return;
  done(null, user);
});

passport.use(new GoogleStrategy({
  callbackURL: '/auth/google/redirect',
  clientID: config.get('clientID'),
  clientSecret: config.get('clientSecret'),
}, async (accessToken, refreshToken, profile, done) => {

    let user = await User.findOne({ "google.googleId": profile.id });
    const localUser = await User.findOne({ "local.email": profile.emails[0].value});
    if (user || localUser) {
      console.log('user exists', user);
      return done(null, user); 
    }
    else {
      user = new User({
        method: 'google',
        google: {
          email: profile.emails[0].value,
          googleId: profile.id,
        },
      });

      const result = await user.save()
        .catch((err) => {
          console.log(err);
        });
      done(null, result);
    }

}));