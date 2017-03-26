var express = require('express');
var router = express.Router();

module.exports = function(passport, database){

  router.get('/necessary', function(req, res, next) {
    res.send('You are necessary.');
    
  });

  router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));

  router.get('/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/auth/succeed',
      failureRedirect: '/auth/failed'
    }));

  router.get('/succeed', function(req, res, next) {
    if (req.user) {
      res.send('succeed '+req.user.name );
    } else {
      res.redirect('/auth/failed');
    }
  });

  router.get('/failed', function(req, res, next) {
    res.send('failed');
  });


  router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/auth');
  });
  return router;
}
