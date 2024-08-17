exports.up = knex => knex.schema.createTable("favourites", table => {
  table.increments("id");
  table.integer("plate_id").references("id").inTable("plates").onDelete("CASCADE");
  table.integer("user_id_who_favourited").references("id").inTable("users");
});


exports.down = knex => knex.schema.dropTable("favourites");

