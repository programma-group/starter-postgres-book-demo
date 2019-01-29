const clamp = require('lodash.clamp');
const Book = require('../models/book');

const searchBooks = async (req, res) => {
  const {
    description,
    title,
    orderId,
    orderAsin,
    orderTitle,
  } = req.query;
  const limit = clamp(req.query.limit || 100, 1, 100);
  const queryPromise = Book
    .query()
    .skipUndefined()
    .allowEager('reviews')
    .where('id', req.query.id)
    .where('asin', req.query.asin)
    .where('description', 'ilike', description ? `%${description}%` : undefined)
    .where('title', 'ilike', title ? `%${title}%` : undefined)
    .eager(req.query.eager)
    .limit(limit);
  if (orderId === 'asc' || orderId === 'desc') {
    queryPromise.orderBy('id', orderId);
  }
  if (orderAsin === 'asc' || orderAsin === 'desc') {
    queryPromise.orderBy('asin', orderAsin);
  }
  if (orderTitle === 'asc' || orderTitle === 'desc') {
    queryPromise.orderBy('title', orderTitle);
  }
  const data = await queryPromise;
  return res.send({
    ok: true,
    data,
  });
};

module.exports = {
  searchBooks,
};
