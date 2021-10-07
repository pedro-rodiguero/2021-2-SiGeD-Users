const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config();
const MongoHelper = require('./infra/helpers/mongo-helpers');

const {
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_HOST,
  PORT,
} = process.env;

const url = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;

MongoHelper.connect(url);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
