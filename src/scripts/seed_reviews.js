require('dotenv').config();
const fs = require('fs');
const LineByLineReader = require('line-by-line');
const Book = require('./../models/book');
const { init } = require('../db');
const { getArgv } = require('../utils/console');

const mapToReview = line => ({
  reviewerID: line.reviewerID || '',
  asin: line.asin,
  summary: line.summary || '',
  reviewerName: line.reviewerName || '',
  reviewText: line.reviewText || '',
  overall: line.overall || 0,
  unixReviewTime: (new Date(line.unixReviewTime * 1000)).toISOString(),
  helpfulCount: line.helpful[0] || 0,
  totalHelpfulCount: line.helpful[1] || 0,
});

const insertReviews = (valuesArray) => {
  const len = valuesArray.length;
  if (len === 0) {
    return Promise.resolve();
  }
  const valuesArrayProcessed = '(?::jsonb),'.repeat(len).replace(/,$/, '');
  const query = `
     INSERT INTO "reviews" ("reviewerID", summary, "reviewerName", "reviewText", overall,
       "unixReviewTime", "helpfulCount", "totalHelpfulCount", "bookId") SELECT
          t."jsonData"->>'reviewerID', t."jsonData"->>'summary', t."jsonData"->>'reviewerName',
          t."jsonData"->>'reviewText', (t."jsonData"->>'overall')::integer,
          (t."jsonData"->>'unixReviewTime')::timestamp, (t."jsonData"->>'helpfulCount')::integer, (t."jsonData"->>'totalHelpfulCount')::integer, b.id FROM (VALUES ${valuesArrayProcessed}) as t("jsonData") INNER JOIN Books b ON t."jsonData"->>'asin' = b.asin`;
  return Book.knex().raw(query, valuesArray);
};

init().then(async () => {
  let seedData = [];
  const lineReader = new LineByLineReader(fs.createReadStream(getArgv(2)));
  const insertReview = (line) => {
    let parsed;
    try {
      // eslint-disable-next-line no-eval
      eval(`parsed = ${line}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
    if (!parsed) {
      // eslint-disable-next-line no-console
      console.log(parsed);
      process.exit(1);
    }
    const reviewData = mapToReview(parsed);
    seedData.push(reviewData);
  };
  const flushSeedData = (finishProcessOnInsert = false) => {
    const copy = [...seedData];
    insertReviews(copy)
      .then(() => {
        lineReader.resume();
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        process.exit(1);
      }).then(() => {
        if (finishProcessOnInsert) {
          process.exit(0);
        }
      });
    seedData = [];
  };
  let n = 0;
  lineReader.on('line', (line) => {
    n += 1;
    if (n > 1000000) {
      lineReader.close();
    } else {
      insertReview(line);
    }
    if (n % 10000 === 0) {
      // eslint-disable-next-line no-console
      console.log(n);
      lineReader.pause();
      flushSeedData();
    }
  });

  lineReader.on('end', async () => {
    // eslint-disable-next-line no-console
    console.log('Finished');
    flushSeedData(true);
  });
});
