// tslint:disable:no-any
import client from "@sendgrid/client";
import { ClientRequest } from "@sendgrid/client/src/request";
import { ClientResponse } from "@sendgrid/client/src/response";
import config from "config";

export function getSendgrid(opts: any): any {
  client.setApiKey(config.gateways.sendgridApiKey);

  const sendgrid = {
    ...opts,
    apiKey: process.env.SENDGRID_API_KEY,
    client
  };
  const request: ClientRequest = {
    method: sendgrid.method,
    url: sendgrid.url,
    body: []
  };

  sendgrid.addSubscription = (
    email: string
  ): Promise<[ClientResponse, any]> => {
    request.body = [{ email }];
    return client.request(request);
  };

  return sendgrid;
}
