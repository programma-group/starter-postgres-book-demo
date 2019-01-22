const tableName = 'books';

exports.up = function up(knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('asin');
    table.text('description');
    table.string('imUrl', 1000);
    table.string('title', 1000);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists(tableName);
};
