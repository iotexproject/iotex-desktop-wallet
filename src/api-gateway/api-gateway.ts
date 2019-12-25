import { ApolloServer } from "apollo-server-koa";
import * as path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
// @ts-ignore
import { MyServer } from "../server/start-server";
import { AntennaResolver } from "./resolvers/antenna";
import { MetaResolver } from "./resolvers/meta";
import { SolcResolver } from "./resolvers/solc";
import { TokenResolver } from "./resolvers/token";

export async function setApiGateway(server: MyServer): Promise<void> {
  const resolvers = [
    MetaResolver,
    AntennaResolver,
    SolcResolver,
    TokenResolver
  ];
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
