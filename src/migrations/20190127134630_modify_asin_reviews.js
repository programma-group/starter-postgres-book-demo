exports.up = function(knex, Promise) {
  return knex.schema.table('reviews', (table) => {
    table.dropColumn('asin');
    table.integer('bookId');
    table.foreign('bookId').references('id').inTable('books');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('reviews', (table) => {
    table.string('asin');
    table.dropColumn('bookId');
  });
};
