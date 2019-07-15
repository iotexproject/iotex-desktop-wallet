import { AxiosResponse } from "axios";
import config from "config";
import RpcMethod from "iotex-antenna/lib/rpc-method/node-rpc-method";
// @ts-ignore
import { Config, Server } from "onefx/lib/server";
import { AntennaResolver } from "../api-gateway/resolvers/antenna";
import { MetaResolver } from "../api-gateway/resolvers/meta";
import { setModel } from "../model";
import "../shared/common/setup-big-number";
import { setGateways } from "./gateways/gateways";
import { setMiddleware } from "./middleware";
import { setServerRoutes } from "./server-routes";

export type MyServer = Server & {
  resolvers: Array<typeof MetaResolver | typeof AntennaResolver>;
  model: {};
  gateways: {
    antenna: RpcMethod;
    coinmarketcap: { fetchCoinPrice(): Promise<AxiosResponse> };
    sendgrid: {};
  };
  config: MyConfig;
};

export type MyConfig = Config & {
  gateways: {
    iotexAntenna: string;
    sendgrid: {};
  };
  bidContractAddress: string;
  vitaTokens: object;
  multiChain: object;
  defaultERC20Tokens: object;
  webBpApiGatewayUrl: string;
  enableSignIn: boolean;
  apiGatewayUrl: string;
  analyticsApiGatewayUrl: string;
};

const defaultConfig: Config = {
  project: "",
  server: {
    host: "",
    port: "",
    staticDir: "",
    delayInitMiddleware: false,
    cookie: {
      secrets: []
    },
    noSecurityHeadersRoutes: {},
    noCsrfRoutes: {}
  },
  gateways: {
    logger: {
      enabled: false,
      baseDir: "",
      topicName: "",
      level: "debug"
    }
  },
  csp: {},
  analytics: {},
  session: {}
};
const serverConfig: Config = {
  ...defaultConfig,
  ...config
};

export async function startServer(): Promise<MyServer> {
  const server = new Server(serverConfig as MyConfig) as MyServer;
  setGateways(server);
  setMiddleware(server);
  setModel(server);
  setServerRoutes(server);

  const defaultPort = process.env.PORT || "4004";
  const port = Number(defaultPort) || config.get("server.port");

  server.listen(port);
  return server;
}
