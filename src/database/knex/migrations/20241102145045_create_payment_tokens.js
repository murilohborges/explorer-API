exports.up = knex => knex.schema.createTable("payment_tokens", table => {
  table.increments('id').primary();
  table.text('token').notNullable();
  table.string('sessionId').nullable()
  table.timestamp('created_at').defaultTo(knex.fn.now());
});


exports.down = knex => knex.schema.dropTable("payment_tokens");