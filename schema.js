var graphql = require('graphql')
const SnippetModel = require('./models/snippet');
const SnippetType = require('./types/snippet');

var GraphQLObjectType = graphql.GraphQLObjectType
var GraphQLInt = graphql.GraphQLInt
var GraphQLBoolean = graphql.GraphQLBoolean
var GraphQLString = graphql.GraphQLString
var GraphQLList = graphql.GraphQLList
var GraphQLNonNull = graphql.GraphQLNonNull
var GraphQLSchema = graphql.GraphQLSchema

var QueryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    todos: {
      type: new graphql.GraphQLList(SnippetType),
      resolve: async () => {
        try {
          const result = await SnippetModel.find();
          return result;
        } catch (e) {
          console.log(e);
        }
      }
    }
  })
});

const MutationAdd = {
  type: new GraphQLList(SnippetType),
  description: 'Add a Snippet',
  args: {
    id: {
      type: graphql.GraphQLInt,
    },
    title: {
      name: 'Snippet title',
      type: new GraphQLNonNull(GraphQLString)
    },
    body: {
      name: 'Snippet body',
      type: new GraphQLNonNull(GraphQLString)
    },
    completed: {
      name: 'Snippet status',
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  },
  resolve: async (root, args) => {
    try {
      let snippet = new SnippetModel({
        id: (new Date()).getTime(),
        title: args.title,
        body: args.body,
        completed: args.completed,
      });
      const r = await snippet.save();
      return r;
    } catch (e) {
      console.log(e);
    }
  }

};

var MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    add: MutationAdd,
  }
});

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});
