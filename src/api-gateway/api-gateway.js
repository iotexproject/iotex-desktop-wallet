// @flow
import fs from 'fs';
import {GraphQLDateTime} from 'graphql-iso-date';
import {ApolloServer, gql} from 'apollo-server-koa';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`${fs.readFileSync(`${__dirname}/api-gateway.graphql`)}`;

export function setApiGateway(server: any) {

  const resolvers = {
    Query: {
      // meta
      health: () => new Date(),
    },
    Mutation: {
    },
    Date: GraphQLDateTime,
  };
  server.resolvers = resolvers;

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: async({ctx}: any) => {
      return {};
    },
  });
  const path = '/api-gateway/';
  apollo.applyMiddleware({app: server.app, path});
}
