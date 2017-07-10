const db = require('../db');

const SnippetSchema = db.Schema(
  {
    title: String,
    body: String,
    completed: Boolean(),
  }
);

module.exports = SnippetSchema;
