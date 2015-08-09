const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const routeBuilder = require('express-routebuilder');
const cors = require('cors');
const morgan = require('morgan');
const authenticate = require('./middleware/authenticate');

const modulePath = path.join(__dirname, 'modules');
const resources = fs.readdirSync(modulePath);

const app = express();

const API = require('./classes/api');
const config = require('./config');

const jwt = require('jsonwebtoken');
const jwtOpts = { expiresInMinutes: 60 * 60 * 24 };

const User = require('./modules/users/model');

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({
  type: ['application/json', 'application/vnd.api+json']
}));

app.get('/v1', function(req, res) {
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify(API.index(), null, 2));
});

app.get('/', function(req, res) {
  res.redirect('/v1');
});

app.post('/v1/signup', function(req, res) {
  User.forge(req.body.user).save().then(function(user) {
    res.status(201).json(user.omit('hashed_password', 'salt'));
  });
});

app.post('/v1/sessions', function(req, res) {
  var token = '';

  User.findByEmail(req.body.email, function(err, user) {
    if (err) {
      return res.status(400).send('Invalid email address');
    }

    if (user.authenticate(req.body.password)) {
      token = jwt.sign({ sub: user.get('id') }, config.secret, jwtOpts);
      res.json({ token: token });
    } else {
      res.status(400).send('Invalid password');
    }
  });
});

app.use(authenticate);

app.get('/v1/me', function(req, res) {
  res.json(req.user.omit('hashed_password', 'salt'));
});

resources.forEach(function(resource) {
  API.register(resource);
  app.use(API.endpoint(resource));
});

module.exports = app;
