const graphql = require('graphql')

const GraphQLObjectType = graphql.GraphQLObjectType
const GraphQLInt = graphql.GraphQLInt
const GraphQLBoolean = graphql.GraphQLBoolean
const GraphQLString = graphql.GraphQLString

const SnippetType = new graphql.GraphQLObjectType({
  name: 'snippet',
  fields: () => ({
    id: {
      type: graphql.GraphQLInt,
    },
    title: {
      type: graphql.GraphQLString,
    },
    body: {
      type: graphql.GraphQLString,
    },
    completed: {
      type: graphql.GraphQLBoolean,
    },
  })
});

module.exports = SnippetType;
