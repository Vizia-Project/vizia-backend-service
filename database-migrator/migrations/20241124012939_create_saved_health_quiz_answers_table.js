/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("health_quiz_answers", (table) => {
    table.increments("id").primary();
    table.integer("result_analysis_id").unsigned().notNullable();
    table.integer("answer").notNullable();

    table
      .foreign("result_analysis_id")
      .references("id")
      .inTable("saved_analysis_results");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("health_quiz_answers");
