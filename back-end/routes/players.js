const express = require('express');
const tokenDecode = require('../util/tokenDecode');
const _ = require('lodash');
const { auth } = require('../middleware/auth');
const { Player, validatePlayer } = require('../models/player');

const router = express.Router();

// Create player that is logged in
router.post('/create', auth, async (req, res) => {
  const id = tokenDecode(req)._id;

  let player = await Player.findOne({ userId: id});
  if (player) return res.status(400).send('player already exists');

  player = new Player({
    health: 100,
    exp: 0,
    level: 0,
    userId: id
  });
  const result = await player.save()
    .catch(err => {
      console.log(err);
    });
  const payload = _.pick(result, ['health', 'exp', 'level']);
  res.send(payload);
});

// Retrieve player that is logged in
router.get('/get', auth, async (req, res) => {
  const id = tokenDecode(req)._id;
  const player = await Player.findOne({ userId: id}).select('-_id -userId -__v');
  if (!player) return res.status(404).send('Player not found');
  res.send(player);
});

// updates the player's information
router.put('/update', auth, async (req, res) => {
  const { error } = validatePlayer(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const id = tokenDecode(req)._id;

  let player = Player.findOne({ userId: id});
  if(!player) return res.status(404).send('Player not found');

  const { health, exp, level } = req.body;
  player = await Player.findOneAndUpdate({ userId: id}, {
    health: health,
    exp: exp,
    level: level,
    userId: id,
  }, { new: true })
    .catch(err => {
      return res.status(500).send('Could not update player information');
    });
  const payload = _.pick(player, ['health', 'exp', 'level']);
  console.log(payload);
  res.send(payload);
});

module.exports = router;