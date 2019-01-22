const { Model } = require('objection');

class Review extends Model {
  static get useLimitInFirst() {
    return true;
  }

  static get tableName() {
    return 'reviews';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['reviewerID', 'asin', 'reviewerName', 'reviewText',
        'overall', 'summary', 'unixReviewTime', 'helpfulCount', 'totalHelpfulCount'],
      properties: {
        reviewerID: {
          type: 'string',
          maxLength: 255,
        },
        asin: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        reviewerName: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        reviewText: {
          type: 'string',
        },
        overall: {
          type: 'integer',
        },
        unixReviewTime: {
          type: 'string',
        },
        helpfulCount: {
          type: 'integer',
        },
        totalHelpfulCount: {
          type: 'integer',
        },
      },
    };
  }
}

module.exports = Review;
