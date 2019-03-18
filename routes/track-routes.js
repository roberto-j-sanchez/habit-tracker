const express = require('express');
const router = express.Router();
const Habit = require('../models/habit-model');
const Tracking = require('../models/tracking-model');

// create a new tracking event
router.post('/habits/:habitId/add-tracking', (req, res, next) => {
  const newTrackingEvent = {
    user: req.user._id,
    completed: req.body.completed,
    note: req.body.note,
    canBeChanged: false
  }

  Tracking.create(newTrackingEvent)
  .then(newTrackingEvent => {
    // find the habit that the new tracking event belongs to
    Habit.findById(req.params.habitId)
    .then(foundHabit => {
      // when habit is found, push the ID of the new tracking event into the 'tracking' array
      foundHabit.tracking.push(newTrackingEvent._id);
      // save the changes in the found habit
      foundHabit.save()
      .then(() => {
        res.redirect(`/habits/${foundHabit._id}`)
      })
      .catch( err => next(err) );
    })
    .catch( err => next(err) );
  })
  .catch( err => next(err) );
})

// delete tracking event
router.post('/tracking/:id', (req, res, next) => {
  Tracking.findByIdAndDelete(req.params._id)
  .then(() => {
    Habit.findOne({'habits': req.params.id})
    .then(foundHabit => {
      for(let i=0; i < foundHabit.tracking.length; i++){
        if(foundHabit.tracking[i]._id.equals(req.params._id)){
          foundHabit.tracking.splice(i, 1);
        }
      }
      foundHabit.save()
      .then(() => {
        res.redirect(`/habits/${foundHabit._id}`)
      })
      .catch( err => next(err) )
    }) 
  })
})

module.exports = router;