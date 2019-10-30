const mongoose = require(mongoose);

const userSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['local', 'google'],
  },
  local: {
    email: {
      type: String,
      lowercase: true,
    },
  },
  google: {
    email: {
      type: String,
      lowercase: true,
    },
    googleId: {
      type: String,
    }
  },
});

const User = mongoose.model('User', userSchema);

module.exports.userSchema = userSchema;
module.exports.User = User;