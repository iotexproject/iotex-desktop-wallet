import { ApolloServer, gql } from "apollo-server-koa";
import fs from "fs";
import { GraphQLDateTime } from "graphql-iso-date";
// @ts-ignore
import { Server } from "onefx";

// Construct a schema, using GraphQL schema language
// tslint:disable
const typeDefs = gql`
  ${fs.readFileSync(`${__dirname}/api-gateway.graphql`)}
`;
// tslint:enable

export function setApiGateway(server: Server): void {
  const resolvers = {
    Query: {
      // meta
      health: () => new Date()
    },
    Mutation: {},
    Date: GraphQLDateTime
  };
  server.resolvers = resolvers;

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: async _ => {
      return {};
    }
  });
  const path = "/api-gateway/";
  apollo.applyMiddleware({ app: server.app, path });
}
