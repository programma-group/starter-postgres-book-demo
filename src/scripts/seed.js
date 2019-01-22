require('dotenv').config();
const fs = require('fs');
const zlib = require('zlib');
const LineByLineReader = require('line-by-line');
const { transaction } = require('objection');
const Book = require('./../models/book');
const { init } = require('../db');
const Queue = require('bluebird-queue');


const mapToReview = line => ({
  reviewerID: line.reviewerID,
  asin: line.asin,
  summary: line.summary,
  reviewerName: line.reviewerName,
  reviewText: line.reviewText,
  overall: line.overall,
  unixBookTime: (new Date(line.unixReviewTime * 1000)).toISOString(),
  helpfulCount: line.helpful[0],
  totalHelpfulCount: line.helpful[1],
});

const mapToBook = line => ({
  asin: line.asin,
  imUrl: line.imUrl,
  title: line.title,
  description: line.description,
});

init().then(async () => {
  // const lineReader = readline.createInterface({
  //   input: fs.createReadStream('/home/asdrubalivan/Downloads/meta_Books.json.gz').pipe(zlib.createGunzip()),
  // });
  const lineReader = new LineByLineReader(fs.createReadStream('/home/asdrubalivan/Downloads/meta_Books.json'));
  const myQ = new Queue({
    concurrency: 5,
    onComplete: () => {
      lineReader.resume();
    },
  });

  const insertBook = (line) => {
    let parsed;
    try {
      eval(`parsed = ${line}`); // This is not a great thing, we ought to solve this
    } catch (err) {
      console.log(line);
      console.log(err);
      process.exit(1);
    }
    const reviewData = mapToBook(parsed);
    return myQ.addNow(() => Book.query().insert(reviewData));
  };
  let n = 0;
  lineReader.on('line', (line) => {
    n += 1;
    if (n > 1000000) {
      lineReader.close();
    } else {
      insertBook(line);
    }
    if (n % 1000 === 0) {
      lineReader.pause();
    }
  });

  lineReader.on('end', async () => {
    console.log('Finished');
  });
});
