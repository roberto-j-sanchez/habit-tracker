const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../../models/user-model');

passport.use(new LocalStrategy({
  usernameField: 'email'
}, (email, password, next) => {
  User.findOne({ email })
  .then(userFromDb => {
    if(!userFromDb){
      return next(null, false, { message: 'Invalid email'})
    }

    if(userFromDb.password){
      if(!bcrypt.compareSync(password, userFromDb.password)){
        return next(null, false, { message: 'Invalid password'})
      }
    } else {
      return next(null, false, { message: 'This email is used for your social login'})
    }
    return next(null, userFromDb)
  })
  .catch( err => next(err))
}))