const tableName = 'reviews';

exports.up = function up(knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('reviewerID');
    table.string('asin');
    table.string('reviewerName');
    table.text('reviewText');
    table.decimal('overall');
    table.string('summary');
    table.timestamp('unixReviewTime');
    table.integer('helpfulCount');
    table.integer('totalHelpfulCount');
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists(tableName);
};
