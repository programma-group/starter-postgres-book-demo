require('dotenv').config();
const fs = require('fs');
const LineByLineReader = require('line-by-line');
const Book = require('./../models/book');
const { init } = require('../db');
const { getArgv } = require('../utils/console');

const mapToBook = line => ({
  asin: line.asin,
  imUrl: line.imUrl,
  title: line.title,
  description: line.description,
});

init().then(async () => {
  let seedData = [];
  const lineReader = new LineByLineReader(fs.createReadStream(getArgv(2)));
  const insertBook = (line) => {
    let parsed;
    try {
      // eslint-disable-next-line no-eval
      eval(`parsed = ${line}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
    const reviewData = mapToBook(parsed);
    seedData.push(reviewData);
  };
  const flushSeedData = (finishProcessOnInsert = false) => {
    const copy = [...seedData];
    console.log('Inserting', copy.length, finishProcessOnInsert);
    // eslint-disable-next-line no-console
    Book.query().insert(copy)
      .then(() => {
        lineReader.resume();
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        process.exit(1);
      })
      .then(() => {
        if (finishProcessOnInsert) {
          process.exit(0);
        }
      });
    seedData = [];
  };
  let n = 0;
  lineReader.on('line', (line) => {
    n += 1;
    if (n > 10000) {
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
