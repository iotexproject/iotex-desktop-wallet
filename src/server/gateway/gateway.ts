import mongoose from 'mongoose';
// @ts-ignore
import {Server} from 'onefx/lib/server';

export function setGateways(server: Server): void {
  server.gateways = server.gateways || {};

  if (!(server.config.gateways.mongoose && server.config.gateways.mongoose.uri)) {
    server.logger.warn('cannot start server without gateways.mongoose.uri provided in configuration');
  } else {
    mongoose.connect(server.config.gateways.mongoose.uri).catch(err => {
      server.logger.warn(`failed to connect mongoose: ${err}`);
    });
  }
  server.gateways.mongoose = mongoose;
}
