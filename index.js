var express = require('express')
var Schema = require('./schema')
var graphQLHTTP = require('express-graphql')

var app = express();
app.use('/', graphQLHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}));
app.listen(process.env.PORT || 4000, () => {
  console.log(`GraphQL Server is now running on localhost:${process.env.PORT || 4000}`);
});
