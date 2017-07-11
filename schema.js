var graphql = require('graphql')
var AWS = require('aws-sdk');

const SnippetModel = require('./models/snippet');
const SnippetType = require('./types/snippet');

AWS.config.update({
  region: "eu-west-1",
  endpoint: "dynamodb.eu-west-1.amazonaws.com"
});

var awsDB = new AWS.DynamoDB.DocumentClient();


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

const addToMongoDB = async ({ title, body, completed }) => {
  const snippet = new SnippetModel({
    id: (new Date()).getTime(),
    title,
    body,
    completed,
  });
  return await snippet.save();
}

const addToDynamoDB = async ({ title, body, completed }) => {
  let params = {
      TableName: 'Snippets',
      Item:{
        title,
        body,
        completed,
      }
  };
  return await awsDB.put(params, async data => JSON.stringify(data, null, 2));
}

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
      addToMongoDB(args);
      addToDynamoDB(args);
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
