require('dotenv').config({
  path: '../.env',
});

const {
  DB_MIN_POOL, DB_MAX_POOL, DATABASE_URL,
} = process.env;

module.exports = {
  development: {
    client: 'postgresql',
    connection: DATABASE_URL,
    pool: {
      min: parseInt(DB_MIN_POOL, 10),
      max: parseInt(DB_MAX_POOL, 10),
    },
  },
};
