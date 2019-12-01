const express = require('express');
const tokenDecode = require('../util/tokenDecode');
const { auth } = require('../middleware/auth');
const { Player } = require('../models/player');

const router = express.Router();

// Create player that is logged in
router.post('/create', auth, async (req, res) => {
  const id = tokenDecode(req)._id;

  let player = await Player.findOne({ userId: id});
  console.log('player exists', player);
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
  console.log('player created', result);
});

module.exports = router;