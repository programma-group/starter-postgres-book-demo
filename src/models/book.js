const { Model } = require('objection');

class Book extends Model {
  static get useLimitInFirst() {
    return true;
  }

  static get tableName() {
    return 'books';
  }

  static get relationMappings() {
    return {
      reviews: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/review`,
        join: {
          from: 'books.id',
          to: 'reviews.bookId',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['asin'], // description is optional
      properties: {
        asin: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        description: {
          type: 'string',
        },
        imUrl: {
          type: 'string',
        },
        title: {
          type: 'string',
        },
      },
    };
  }
}

module.exports = Book;
