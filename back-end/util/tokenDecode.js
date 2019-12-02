const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function tokenDecode(req) {
  const token = req.session.token;
  const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
  return decoded;
};