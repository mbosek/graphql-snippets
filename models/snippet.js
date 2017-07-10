const db = require('../db');
const SnippetSchema = require('../schemas/snippet');

const Snippet = db.model('Snippet', SnippetSchema);

module.exports = Snippet;
