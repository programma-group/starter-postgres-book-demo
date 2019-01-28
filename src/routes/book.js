const express = require('express');
const bookController = require('../controllers/book');
const { catchErrors } = require('../handlers/error');

const router = express.Router();

router.get('/', catchErrors(bookController.searchBooks));

module.exports = router;
