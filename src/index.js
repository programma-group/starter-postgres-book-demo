require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 3000;

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Listening on port ${port}`));
