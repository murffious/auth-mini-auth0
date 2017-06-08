//Variables
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const port = 3000
const app = express()
const config = require('./.config.js')

//======Middleware
app.use(session({
  resave: true, //Without this you get a constant warning about default values
  saveUninitialized: true, //Without this you get a constant warning about default values
  secret: config.secret
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new Auth0Strategy({
  domain: config.domain,
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  callbackURL: 'http://localhost:3000/auth/callback'
}, function(accessToken, refreshToken, extraParams, profile, done) {
  return done(null, profile);
}));

// =======   Endpoints
app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback',
  passport.authenticate('auth0', {successRedirect: '/auth/me'}), function(req, res) {
    res.status(200).send(req.user);
})
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
app.get('/auth/me', function(req, res) {
  if (!req.user) return res.sendStatus(404);
  //THIS IS WHATEVER VALUE WE GOT FROM userC variable above.
  res.status(200).send(req.user);
})




//listening 
app.listen(port, function (){
    console.log('listening on port ' + port)
})