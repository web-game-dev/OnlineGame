const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  health: {
    type: Number,
    required: true,
  },
  exp: {
    type: Number,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

const Player = mongoose.model('Player', playerSchema);

function validatePlayer(player) {
  const schema = {
    health: Joi.number().required(),
    exp: Joi.number().required(),
    level: Joi.number().required()
  };
  return Joi.validate(player, schema);
}

module.exports.playerSchema = playerSchema;
module.exports.validatePlayer = validatePlayer;
module.exports.Player = Player;