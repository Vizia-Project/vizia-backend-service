/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("saved_analysis_results", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.string("information_id").notNullable();
    table.string("photo_url").notNullable();
    table.string("prediction").notNullable();
    table.double("accuracy").notNullable();
    table.timestamp("timestamp").defaultTo(knex.fn.now());

    table.foreign("user_id").references("id").inTable("users");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("saved_analysis_results");
