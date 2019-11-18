const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User, validateUser } = require('../models/user');


describe('user.generateAuthToken', () => {
  it('should return a valid json web token', () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
    }
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    expect(decoded).toMatchObject(payload);
  });
});



