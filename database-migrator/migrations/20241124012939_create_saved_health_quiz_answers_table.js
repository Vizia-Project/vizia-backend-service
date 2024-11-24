/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("health_quiz_answers", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.integer("question_id").unsigned().notNullable();
    table.integer("result_analysis_id").unsigned().notNullable();
    table.boolean("answer").notNullable();

    table.foreign("user_id").references("id").inTable("users");
    table
      .foreign("question_id")
      .references("id")
      .inTable("health_quiz_questions");
    table
      .foreign("result_analysis_id")
      .references("id")
      .inTable("health_quiz_questions");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("health_quiz_answers");
