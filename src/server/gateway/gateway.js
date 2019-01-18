import mongoose from 'mongoose';

export function setGateways(server) {
  server.gateways = server.gateways || {};

  if (!(server.config.gateways.mongoose && server.config.gateways.mongoose.uri)) {
    server.logger.warn('cannot start server without gateways.mongoose.uri provided in configuration');
  } else {
    mongoose.connect(server.config.gateways.mongoose.uri);
  }
  server.gateways.mongoose = mongoose;
}
