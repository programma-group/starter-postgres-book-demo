require('dotenv').config();
const fs = require('fs');
const LineByLineReader = require('line-by-line');
const Book = require('./../models/book');
const { init } = require('../db');

const mapToBook = line => ({
  asin: line.asin,
  imUrl: line.imUrl,
  title: line.title,
  description: line.description,
});

init().then(async () => {
  let seedData = [];
  const lineReader = new LineByLineReader(fs.createReadStream('/home/asdrubalivan/Downloads/meta_Books.json'));
  const insertBook = (line) => {
    let parsed;
    try {
      // eslint-disable-next-line no-eval
      eval(`parsed = ${line}`); // This is not a great thing, we ought to solve this
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
    const reviewData = mapToBook(parsed);
    seedData.push(reviewData);
  };
  const flushSeedData = (finishProcessOnInsert = false) => {
    const copy = [...seedData];
    // eslint-disable-next-line no-console
    Book.query().insert(copy).catch(console.log).then(() => {
      if (finishProcessOnInsert) {
        process.exit(0);
      }
    });
    seedData = [];
    lineReader.resume();
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
      flushSeedData();
    }
  });

  lineReader.on('end', async () => {
    // eslint-disable-next-line no-console
    console.log('Finished');
    flushSeedData(true);
  });
});
