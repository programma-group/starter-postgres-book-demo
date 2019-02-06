const clamp = require('lodash.clamp');
const Book = require('../models/book');

const getQuery = (base, req, getBooks = true) => {
  const {
    orderId,
    orderAsin,
    orderTitle,
  } = req.query;
  let condition = base
    .skipUndefined()
    .where('id', req.query.id)
    .where('asin', req.query.asin)
    .where('description', 'ilike', req.query.description ? `%${req.query.description}%` : undefined)
    .where('title', 'ilike', req.query.title ? `%${req.query.title}%` : undefined);
  if (orderId === 'asc' || orderId === 'desc') {
    condition = condition.orderBy('id', orderId);
  }
  if (orderAsin === 'asc' || orderAsin === 'desc') {
    condition = condition.orderBy('asin', orderAsin);
  }
  if (orderTitle === 'asc' || orderTitle === 'desc') {
    condition = condition.orderBy('title', orderTitle);
  }
  if (getBooks) {
    const limit = clamp(req.query.limit || 100, 1, 100);
    condition = condition.limit(limit)
      .allowEager('reviews')
      .eager(req.query.eager);
  }
  return condition;
};

const searchBooks = async (req, res) => {
  const [data, total] = await Promise.all([
    getQuery(Book.query(), req),
    getQuery(Book.query().count(), req, false),
  ]);
  return res.send({
    ok: true,
    data,
    total: Number(total[0].count),
  });
};

module.exports = {
  searchBooks,
};
