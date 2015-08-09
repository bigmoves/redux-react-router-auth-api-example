exports.seed = function (knex, Promise) {
  return Promise.join(

    knex('users').del(),
    knex('users').insert({
      id: 1,
      name: 'Steve Jobs',
      email: 'steve.jobs@example.com',
      hashed_password: 'lCpYKh6UhhIAkZd1/Ju/+pwdlafNS6qkoGdYgW+DiCjalqHdlRQi3801bYdlSnZeb91RRduKPuG89kB74erhgg==',
      salt: 'VNDrqHsAOfxXtEZ8DugtiQ=='
    })
  );
};
