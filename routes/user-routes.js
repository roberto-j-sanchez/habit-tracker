const express = require('express');
const router  = express.Router();

router.get('/private', (req, res, next) => {
  if(!req.user){
    req.flash('error', 'You have to be logged in to access')
    res.redirect('/login');
    return;
  }
  res.render('user-pages/profile-page');
});

router.get('/about', (req, res, next) => {
  res. render('user-pages/about');
})

module.exports = router;