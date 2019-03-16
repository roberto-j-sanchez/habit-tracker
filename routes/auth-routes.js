const express = require("express");
const router = express.Router();
const passport = require('passport');
const User =  require('../models/user-model');

// bcrypt to encrypt passwords
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// action="/signup"
router.post('/signup', (req, res, next) => {
  const userFullName = req.body.fullName;
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  // Signup - Form validation
  if(userFullName == '' || userEmail == '' || userPassword == ''){
    req.flash('error', 'Please provide a valid email and password.')
    res.redirect('/signup')
    return;
  }

  User.findOne({ email: userEmail })
  .then( foundUser => {
    if( foundUser !== null ){
      req.flash('error', 'This email is already taken.');
      res.redirect('/signup');
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPassword = bcrypt.hashSync(userPassword, salt);

    // Create account
    User.create({
      fullName: userFullName,
      email: userEmail,
      password: hashPassword
    })
    .then( user => {
      req.login(user, (err) => {
        if(err){
          req.flash('error', 'Auto login is not working...')
          res.redirect('/login');
          return;
        }
        res.redirect('/private');
      })
    })
    .catch(err => next(err)); // closing User.create
    })
  .catch( err => next(err)); // closing User.findOne()
})

//////////////// LOGIN /////////////////////

router.get('/login', (req, res, next) => {
  res.render('auth/login');
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/habits', // <== successfully logged in
  failureRedirect: '/login', // <== login failed so go to '/login' to try again
  failureFlash: true,
  passReqToCallback: true  
}));

//////////////// LOGOUT /////////////////////

router.post('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login');
})

module.exports = router;