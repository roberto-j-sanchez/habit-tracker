const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const habitSchema = new Schema({
  owner: {type: Schema.Types.ObjectId, ref: 'User' },
  name: {type: String},
  description: { type: String, maxlength: 300 },
  reward: { type: String, maxlength: 100 },
  reason: { type: String, maxlength: 200 },
  repeat: {type: Number},
  timePeriod: { type: String},
  startDate: { type: Date },
  endDate: { type: Date },
  track: [{ type: Schema.Types.ObjectId, ref: 'Track'}]
})

const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit;