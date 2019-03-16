const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trackingSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  completed: [ Date ],
  note: { type: String,  maxlength: 200 },
}, {
  timestamps: true
});

const Tracking = mongoose.model('Track', trackingSchema);
module.exports = Tracking;