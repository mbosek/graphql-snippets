const graphql = require('graphql')
const AWS = require('aws-sdk');

const SnippetModel = require('./models/snippet');
const SnippetType = require('./types/snippet');

AWS.config.update({
  region: "eu-west-1",
  endpoint: "dynamodb.eu-west-1.amazonaws.com"
});

const awsDB = new AWS.DynamoDB.DocumentClient();

const GraphQLObjectType = graphql.GraphQLObjectType
const GraphQLInt = graphql.GraphQLInt
const GraphQLBoolean = graphql.GraphQLBoolean
const GraphQLString = graphql.GraphQLString
const GraphQLList = graphql.GraphQLList
const GraphQLNonNull = graphql.GraphQLNonNull
const GraphQLSchema = graphql.GraphQLSchema

const QueryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    todos: {
      type: new graphql.GraphQLList(SnippetType),
      resolve: async () => {
        try {
          const result = await SnippetModel.find();

          getFromDynamoDB().then(items => console.log('--->', items.length));

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

const getFromDynamoDB = async () => {
  const params = {
    TableName: "Snippets",
  };
  return new Promise((resolve, reject) => {
    return awsDB.scan(params, (err, result) => {
      if (err) reject(err);
      resolve(result.Items);
      });
  });
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

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    add: MutationAdd,
  }
});

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});
