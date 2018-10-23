
// @flow
import console from 'global/console';
import winston from 'winston';

export type Logger = {
  debug: (name: string, meta: ?Object) => void;
  info: (name: string, meta: ?Object) => void;
  warn: (name: string, meta: ?Object) => void;
  error: (name: string, meta: ?Object) => void;
}

export let logger = {
  ...console,
  debug: console.log,
};

export function createLogger(): Logger {
  const transports = [
    new (winston.transports.Console)({
      colorize: 'all',
      timestamp: true,
    }),
  ];

  logger = new (winston.Logger)({
    level: 'info',
    transports,
  });
  return logger;
}
