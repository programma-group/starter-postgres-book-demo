const clamp = require('lodash.clamp');
const Book = require('../models/book');

const getQuery = (base, req, isCount = false) => {
  const {
    orderId,
    orderAsin,
    orderTitle,
  } = req.query;
  const condition = base
    .skipUndefined()
    .allowEager('reviews')
    .where('id', req.query.id)
    .where('asin', req.query.asin)
    .where('description', 'ilike', req.query.description ? `%${req.query.description}%` : undefined)
    .where('title', 'ilike', req.query.title ? `%${req.query.title}%` : undefined)
    .eager(req.query.eager);
  if (orderId === 'asc' || orderId === 'desc') {
    condition.orderBy('id', orderId);
  }
  if (orderAsin === 'asc' || orderAsin === 'desc') {
    condition.orderBy('asin', orderAsin);
  }
  if (orderTitle === 'asc' || orderTitle === 'desc') {
    condition.orderBy('title', orderTitle);
  }
  if (isCount) {
    const limit = clamp(req.query.limit || 100, 1, 100);
    condition.limit(limit);
  }
  return condition;
};

const searchBooks = async (req, res) => {
  const data = await getQuery(Book.query(), req);
  return res.send({
    ok: true,
    data,
  });
};

module.exports = {
  searchBooks,
};
