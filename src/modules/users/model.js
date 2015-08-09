const BaseModel = require('../../classes/base_model');
const crypto = require('crypto');

const instanceProps = {
  tableName: 'users',
  hasTimestamps: true,
  virtuals: {
    password: {
      get: function() {
        return this._password;
      },
      set: function(password) {
        this._password = password;
        this.set('salt', this.makeSalt());
        this.set('hashed_password', this.hashPassword(password));
      }
    }
  },

  authenticate: function(password) {
    return this.hashPassword(password) === this.get('hashed_password');
  },

  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  hashPassword: function(password) {
    if (!password || !this.get('salt')) return '';
    const salt = new Buffer(this.get('salt'), 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

const classProps = {
  typeName: 'users',
  filters: {
    id: function(qb, value) {
      return qb.whereIn('id', value);
    }
  },
  findById: function(id, cb) {
    this.query({
      where: { id: id }
    }).fetch()
    .then(function(user) {
      if (!user) return cb('User not found');
      cb(null, user);
    }).catch(function(err) {
      cb(err);
    });
  },
  findByEmail: function(email, cb) {
    this.query({
      where: { email: email }
    }).fetch()
    .then(function(user) {
      if (!user) return cb(null);
      cb(null, user);
    }).catch(function(err) {
      cb(err);
    });
  }
};

module.exports = BaseModel.extend(instanceProps, classProps);
