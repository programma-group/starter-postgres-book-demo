const clamp = require('lodash.clamp');
const Book = require('../models/book');

const searchBooks = async (req, res) => {
  const {
    orderId,
    orderAsin,
    orderTitle,
    id,
    asin,
    description,
    title,
    page,
  } = req.query;
  const limit = clamp(req.query.limit || 100, 1, 100);
  let condition = Book.query()
    .skipUndefined()
    .where('id', id)
    .where('asin', asin)
    .where('description', 'ilike', description ? `%${description}%` : undefined)
    .where('title', 'ilike', title ? `%${title}%` : undefined)
    .page(page || 0, limit);
  if (orderId === 'asc' || orderId === 'desc') {
    condition = condition.orderBy('id', orderId);
  }
  if (orderAsin === 'asc' || orderAsin === 'desc') {
    condition = condition.orderBy('asin', orderAsin);
  }
  if (orderTitle === 'asc' || orderTitle === 'desc') {
    condition = condition.orderBy('title', orderTitle);
  }
  const data = await condition;
  return res.send({
    ok: true,
    data: data.results,
    total: Number(data.total),
  });
};

module.exports = {
  searchBooks,
};
