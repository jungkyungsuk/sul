var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(config, app, session, database) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    console.log('serializeUser');
    console.log(user);

    return done(null, user.auth_id);
  });

  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser');

    database.findUser('users', id, function(user) {
      if (user) {
        console.log('is');
        return done(null, user);
      } else {
        console.log('no');
        return done('There is no user');
      }

    });
  });

  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: "/auth/facebook/callback",
      profileFields: ['id', 'name', 'picture', 'locale', 'gender', 'email', 'verified', 'displayName'],
    }, function(accessToken, refreshToken, profile, done) {
      var user = {
        'auth_id': 'facebook:'+profile._json.id,
        'name': profile._json.name,
        'email': profile._json.email,
        'picture': profile._json.picture.data.url,
        'locale': profile._json.locale,
        'gender': profile._json.gender,
      };
      database.insertUser('users', user, function(result) {
        return done(null, user);
      });
    }));

  return passport;
}

