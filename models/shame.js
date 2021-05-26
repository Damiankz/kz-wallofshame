const mongoose = require('mongoose')

const shameSchema = new mongoose.Schema({
    author:{
        type: String,
        required: true
    },
    quote: {
        type: String,
        required: true
    },
    shameDate: {
        type: Date,
        required: true,
        default: Date.now
    }
})

shameSchema.statics.random = function(cb) {
    this.count(function(err, count) {
      if (err) return cb(err);
      var rand = Math.floor(Math.random() * count);
      this.findOne().skip(rand).exec(cb);
    }.bind(this));
  };

module.exports = mongoose.model('Shame', shameSchema)