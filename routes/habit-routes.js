const express = require('express');
const router = express.Router();
const Habit = require('../models/habit-model');
const Tracking = require('../models/tracking-model');

// GET route to display form to create a habit
router.get('/habits/add', isLoggedIn, (req, res, next) => {
  res.render('habit-pages/habit-add');
});

// show all habits
router.get('/habits', (req, res, next) => {
  Habit.find().populate('owner')
  .then(habitsFromDB => {
    habitsFromDB.forEach(oneHabit => {
      if(req.user){
        if(oneHabit.owner.equals(req.user._id)){
          oneHabit.isOwner = true;
        }
      }
    })
    res.render('habit-pages/habit-list', { habitsFromDB })
  })
  .catch( err => next(err) )
})



// POST route to create a habit
router.post('/create-habit', (req, res, next) => {
  const { name, description, reward, reason, repeat, timePeriod, startDate  } = req.body;
  Habit.create({
    name,
    description,
    reward,
    reason,
    repeat,
    timePeriod,
    // startDate,
    owner: req.user._id,
    track: []
  })
  .then( newHabit => {
    res.redirect('/habits');
  })
  .catch( err => next(err) )
})





// POST => save updates for a specific habit
router.post('/habits/:habitId/update', (req, res, next) => {

  const { name, description, reward, reason, repeat, timePeriod, startDate  } = req.body;
  
  const updatedHabit = {
    name,
    description,
    reward,
    reason,
    repeat,
    timePeriod,
    // startDate,
    
    owner: req.user.id,
  }

  Habit.findByIdAndUpdate(req.params.habitId, updatedHabit)
  .then( theUpdatedHabit => {
    res.redirect(`/habits/${updatedHabit._id}`);
  })
  .catch( err => next(err) );
})

// delete a specific habit
router.post('/habits/:id/delete', (req, res, next) => {
  Habit.findByIdAndDelete(req.params.id)
  .then(() => {
    res.redirect('/habits');
  })
  .catch( err => next(err) );
})

// makes route and functionality available to user only if user is in session
function isLoggedIn(req, res, next){
  if(req.user){
    next();
  } else {
    req.flash('error', 'You need to log in to access the page.');
    res.redirect('/login');
  }
}




// get the details of a specific habit
router.get('/habits/:habitId', isLoggedIn, (req, res, next) => {
  // populate owner field
  Habit.findById(req.params.habitId).populate('owner').populate('track')
  // populate 'tracking' field and the 'user' field that is inside of tracking
  .populate({path: 'tracking', populate: {path: 'user'}})
  .then( foundHabit => {
    if(foundHabit.owner.equals(req.user._id)){
      foundHabit.isOwner = true;
    }

    // Tracking.find()
    // .then(trackings => {
    //   console.log("trackings: ", trackings)
    //   if (trackings.length !== 0){
    //     Tracking.findById({owner: req.user._id})
    //     Promise.all(foundHabit.tracking.filter(trackingEvent => {
    //       if(trackingEvent.user._id.equals(req.user._id)){
    //         trackingEvent.canBeChanged = true;
    //       }
    //       return trackingEvent;
    //     }))
    //     console.log("-----------------------------------", foundHabit)
    //     .then((foundTracking) => {
    //       res.render('habit-pages/habit-details', { habit: foundHabit, tracking: foundTracking })
    //     })
    //     .catch( err => next(err) );
    //   } else {
        res.render('habit-pages/habit-details', { habit: foundHabit })
    //   }
    // })
  
  })
  .catch( err => next(err) )
})

router.post('/habits/:habitId/add-note', (req, res, next) => {
  theDate = new Date()
  Tracking.create({
    owner: req.user._id,
    completed: Date.now(),
    note: req.body.note
  })
  .then(newNote => {
    Habit.findById(req.params.habitId)
    .then(foundHabit => {
      foundHabit.track.push(newNote._id)
      foundHabit.markModified('trackings')
      foundHabit.save()
      .then(updatedHabit => {
        res.redirect('/habits')
      })
      .catch(err => {
        next(err);
      })
    })
    .catch(err => {
      next(err);
    })
  })
  .catch(err => {
    next(err);
  })
})

module.exports = router;