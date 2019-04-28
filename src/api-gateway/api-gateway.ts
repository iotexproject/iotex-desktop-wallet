import { ApolloServer } from "apollo-server-koa";
// @ts-ignore
import { Server } from "onefx";
import * as path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { AntennaResolver } from "./resolvers/antenna";
import { MetaResolver } from "./resolvers/meta";

import { createHttpLink } from "apollo-link-http";
import {
  introspectSchema,
  makeRemoteExecutableSchema,
  mergeSchemas
} from "graphql-tools";

export async function setApiGateway(server: Server): Promise<void> {
  const resolvers = [MetaResolver, AntennaResolver];
  server.resolvers = resolvers;

  const sdlPath = path.resolve(__dirname, "api-gateway.graphql");
  let schema = await buildSchema({
    resolvers,
    emitSchemaFile: {
      path: sdlPath,
      commentDescriptions: true
    },
    validate: false
  });

  const webbpSceham = await loadWebBPSchema();
  schema = mergeSchemas({
    schemas: [schema, webbpSceham]
  });

  const apollo = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    context: async _ => {
      return {
        gateways: server.gateways
      };
    }
  });
  const gpath = "/api-gateway/";
  apollo.applyMiddleware({ app: server.app, path: gpath });
}

export const loadWebBPSchema = async () => {
  const link = createHttpLink({
    uri: "https://member.iotex.io/api-gateway/"
  });
  const schema = await introspectSchema(link);
  return makeRemoteExecutableSchema({
    schema,
    link
  });
};
