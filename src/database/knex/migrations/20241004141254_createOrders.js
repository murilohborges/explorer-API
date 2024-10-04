exports.up = knex => knex.schema.createTable("orders", table => {
  table.increments("id");
  table.text("status");
  table.text("details");
  table.timestamp("created_at").default(knex.fn.now());
});


exports.down = knex => knex.schema.dropTable("orders");
