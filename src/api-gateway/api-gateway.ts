import { ApolloServer } from "apollo-server-koa";
import { fromRau } from "iotex-antenna/lib/account/utils";
import * as path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
// @ts-ignore
import { MyServer } from "../server/start-server";
import { AntennaResolver } from "./resolvers/antenna";
import { MetaResolver } from "./resolvers/meta";
import { SolcResolver } from "./resolvers/solc";
import { AddressResolver, TokenMetaResolver } from "./resolvers/token";

export async function setApiGateway(server: MyServer): Promise<void> {
  const resolvers = [
    MetaResolver,
    AntennaResolver,
    SolcResolver,
    AddressResolver,
    TokenMetaResolver
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
  apollo.applyMiddleware({ app: server.app, path: gpath, cors: false });

  server.get("api-total-supply", "/api/total-supply", async ctx => {
    const s = await server.gateways.analytics.fetchSupply();
    ctx.response.body = fromRau(String(s.totalSupply), "Iotx");
  });
  server.get("api-circulating-supply", "/api/circulating-supply", async ctx => {
    const s = await server.gateways.analytics.fetchSupply();
    ctx.response.body = fromRau(String(s.totalCirculatingSupply), "Iotx");
  });
  server.get("api-number-of-accounts", "/api/number-of-accounts", async ctx => {
    ctx.response.body = await server.gateways.analytics.totalNumberOfHolders();
  });
}
