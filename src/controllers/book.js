const Book = require('../models/book');

const searchBooks = async (req, res) => {
  const { description, title } = req.query;
  const data = await Book
    .query()
    .skipUndefined()
    .where('id', req.query.id)
    .where('asin', req.query.asin)
    .where('description', 'ilike', description ? `%${description}%` : undefined)
    .where('title', 'ilike', title ? `%${title}%` : undefined)
    .limit(100);
  return res.send({
    ok: true,
    data,
  });
};

module.exports = {
  searchBooks,
};
