// tslint:disable:no-any
import client from "@sendgrid/client";
import { ClientRequest } from "@sendgrid/client/src/request";
import { ClientResponse } from "@sendgrid/client/src/response";
import config from "config";

export interface GatewaysConfig {
  logger: {
    enabled: boolean;
    level: string;
  };
  iotexAntenna: string;
  sendgridApiKey: string;
  sendgrid: {
    url: string;
    method: string;
  };
}

export function getSendgrid(opts: any): any {
  const gateways: GatewaysConfig = config.get("gateways");

  client.setApiKey(gateways.sendgridApiKey);

  const sendgrid = {
    ...opts,
    apiKey: gateways.sendgridApiKey,
    client
  };
  const request: ClientRequest = {
    method: sendgrid.method,
    url: sendgrid.url,
    body: []
  };

  sendgrid.addSubscription = async (
    email: string
  ): Promise<[ClientResponse, any]> => {
    request.body = [{ email }];
    return client.request(request);
  };

  return sendgrid;
}
