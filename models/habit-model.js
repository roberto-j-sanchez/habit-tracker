const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const habitSchema = new Schema({
  name: { type: String },
  description: { type: String },
  reason: { type: String },
  reward: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  owner: { type: Schema.Types.ObjectId, ref: 'User'}
})

const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit;