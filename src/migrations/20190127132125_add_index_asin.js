const indexName = 'books_asin_index';

exports.up = function up(knex) {
  return knex.schema.table('books', (table) => {
    table.index('asin', indexName);
  });
};

exports.down = function down(knex) {
  return knex.schema.table('books', (table) => {
    table.dropIndex('asin', indexName);
  });
};
