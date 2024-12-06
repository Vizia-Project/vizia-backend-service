/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("saved_analysis_results", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.string("date").notNullable();
    table.string("image").notNullable();
    table.string("infection_status").notNullable();
    table.string("prediction_result").notNullable();
    table.double("accuracy").notNullable();
    table.text("information").notNullable();

    table.foreign("user_id").references("id").inTable("users");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("saved_analysis_results");
