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

router.post('/signup', (req, res, next) => {
  const fullName = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;

  // Signup - Form validation
  if(fullName == '' || email == '' || password == ''){
    req.flash('error', 'Please provide a valid email and password.')
    res.redirect('/signup')
    return;
  }

  User.findOne({ email: email })
  .then( user => {
    if( user !== null ){
      req.flash('error', 'This email is already taken.');
      res.redirect('/login');
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPassword = bcrypt.hashSync(password, salt);

    // Create account
    User.create({
      fullName,
      email,
      password: hashPassword
    })
    .then( user => {
      req.login(user, (err) => {
        if(err){
          req.flash('error', 'Auto login is not working...')
          res.redirect('login');
          return;
        }
        res.redirect('/secret');
      })
    })
    .catch(err => next(err));
    })
  .catch( err => next(err));
})

// LOGIN
router.get('/login', (req, res, next) => {
  res.render('auth/login');
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/', // <== successfully logged in
  failureRedirect: '/login', // <== login failed so go to '/login' to try again
  failureFlash: true,
  passReqToCallback: true  
}));

// LOGOUT
router.post('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login');
})

module.exports = router;