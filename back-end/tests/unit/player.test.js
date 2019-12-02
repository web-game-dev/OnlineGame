const mongoose = require('mongoose');
const { validatePlayer } = require('../../models/player');

describe('validate player', () => {

  const player = {
    health: 100,
    exp: 100,
    level: 30,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }

  it('should not return an error if input is valid', () => {
    const result = validatePlayer(player);
    expect(result.error).toBeNull();
  });

  it('should return an error if health is invalid', () => {
    player.health = '';
    const result = validatePlayer(player);
    expect(result.error).not.toBeNull();
  });

  it('should return an error if exp is invalid', () => {
    player.exp = '';
    const result = validatePlayer(player);
    expect(result.error).not.toBeNull();
  });

  it('should return an error if level is invalid', () => {
    player.level = '';
    const result = validatePlayer(player);
    expect(result.error).not.toBeNull();
  });

  it('should return an error if userId is invalid', () => {
    player.userId = '';
    const result = validatePlayer(player);
    expect(result.error).not.toBeNull();
  });
});