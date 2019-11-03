const mongoose = require('mongoose');

module.exports = function(req, res, next) {
  if (!req.user) return res.status(401).send('User is not logged in');

  const userId = req.session.passport.user;
  if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).sehd('Invalid ID');
  next();

}