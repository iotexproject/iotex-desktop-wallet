import { ApolloServer } from "apollo-server-koa";
// @ts-ignore
import { Server } from "onefx";
import * as path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { AntennaResolver } from "./resolvers/antenna";
import { MetaResolver } from "./resolvers/meta";

export async function setApiGateway(server: Server): Promise<void> {
  const resolvers = [MetaResolver, AntennaResolver];
  server.resolvers = resolvers;

  const sdlPath = path.resolve(__dirname, "api-gateway.graphql");
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: {
      path: sdlPath,
      commentDescriptions: true
    },
    validate: false
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
