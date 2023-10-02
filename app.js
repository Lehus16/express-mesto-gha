const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
app.use(express.json());

async function init() {
  await mongoose.connect(MONGO_URL);
  await app.listen(PORT);

  console.log(`app listening on port ${PORT}`);
}

init();
