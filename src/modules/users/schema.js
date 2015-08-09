module.exports = {
  body: {
    properties: {
      id: {
        type: 'integer'
      },
      name: {
        type: 'string'
      },
      email: {
        type: 'string'
      },
      hashed_password: {
        type: 'string'
      },
      salt: {
        type: 'string'
      }
    }
  }
};
