const jwt = require('jsonwebtoken');
const User = require('../modules/users/model');
const config = require('../config');

module.exports = function(req, res, next) {
  const header = req.headers.authorization;
  var jwtPayload = null;
  var token = '';

  if (!header) {
    return res.status(401).end();
  }

  token = header.split(/\s+/).pop();

  if (token) {

    try {
      jwtPayload = jwt.verify(token, config.secret);
    } catch (err) {
      return res.status(401).end();
    }

    User.findById(jwtPayload.sub, function(err, user) {
      if (err) return res.status(401).end();
      req.user = user;
      next();
    });
  }
};
