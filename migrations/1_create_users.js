exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(t) {
      t.increments('id');
      t.string('name').notNullable();
      t.string('email').notNullable();
      t.string('hashed_password').notNullable();
      t.string('salt').notNullable();
      t.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
      t.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('users');
};
