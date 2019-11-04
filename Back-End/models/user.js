const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['local', 'google'],
  },
  local: {
    email: {
      type: String,
    },
    password: {
      type: String,
      min: 5,
      max: 255,
    }
  },
  google: {
    email: {
      type: String,
    },
    googleId: {
      type: String,
    }
  },
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().required()
  };
  return Joi.validate(user, schema);
}


module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.validateUser = validateUser;