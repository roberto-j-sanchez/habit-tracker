const passport = require('passport');
const User = require('../../models/user-model');
const flash = require('connect-flash');

require('./local-strategy');

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((userId, cb) => {
  User.findById(userId)
  .then( user => {
    cb(null, user);
  })
  .catch( err => cb(err));
})

function passportBasicSetup(setup){
  
  setup.use(passport.initialize());
  setup.use(passport.session());

  setup.use(flash());

  setup.use((req, res, next) => {
    res.locals.messages = req.flash();
    if(req.user){
      res.locals.user = req.user;
    }
    next();
  })
}

module.exports = passportBasicSetup;
