exports.up = knex => knex.schema.createTable("plates", table => {
  table.increments("id");
  table.text("avatar");
  table.text("title");
  table.text("category");
  table.text("price");
  table.text("description");
  table.integer("user_id").references("id").inTable("users");

  table.timestamp("created_at").default(knex.fn.now());
  table.timestamp("updated_at").default(knex.fn.now());
});


exports.down = knex => knex.schema.dropTable("plates");
