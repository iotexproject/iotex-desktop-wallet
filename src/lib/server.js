// @flow
import path from 'path';
import process from 'process';
import {hostname} from 'os';
import config from 'config';
import Koa from 'koa';
import type {Application} from 'koa';
import methods from 'methods';
import Router from 'koa-router';
import {Logger} from 'winston';

import {initMiddleware} from './middleware';
import {IntegratedGateways} from './integrated-gateways/integrated-gateways';

export type Config = {
  project: string,
  server: {
    routePrefix: string,
    host: string,
    port: string,
    protocol: 'http:' | 'https:'
  },
  gateways: {
    logger: {
      enabled: boolean,
      baseDir: string,
      topicName: string,
      level: 'debug' | 'info' | 'warn' | 'error',
    },
    mysql: {
      enabled: boolean,
    },
    iotexCore: {
      serverUrl: string,
    }
  },
  analytics: {
    googleTid: string,
  }
}

export class Server {
  app: Application
  gateways: IntegratedGateways
  logger: Logger
  config: Config
  siteURL: string
  httpServer: any
  router: any

  // routes
  all: any

  constructor() {
    this.config = config;
    this.siteURL = siteURL(this.config);
    process.title = `nodejs-web-${this.config.project}-on-${hostname()}`;
    this.app = new Koa();
    this.gateways = new IntegratedGateways(this.config);
    this.logger = this.gateways.logger;
    this.initRouter();

    this.app.keys = ['THIS IS INSECURE, I KNOW', 'will replace once found a correct way'];

    initMiddleware(this);
  }

  initRouter() {
    const router = new Router();
    const self = this;

    methods.forEach(setRouterOnVerb);
    setRouterOnVerb('all');

    function setRouterOnVerb(verb) {
      // $FlowFixMe
      self[verb] = function applyVerb() {
        const args = [].slice.call(arguments);

        let expressRoute = args.shift();
        if (typeof args[0] === 'string') {
          expressRoute = args.shift();
        }

        expressRoute = self.getRoute(expressRoute);
        args.unshift(expressRoute);
        return router[verb](...args);
      };
    }

    this.router = router;
    this.app.use(router.routes());
  }

  get(statsName: string, path: string, ...handlers: any) {
    this.router.get(statsName, path, ...handlers);
  }

  post(statsName: string, path: string, ...handlers: any) {
    this.router.post(statsName, path, ...handlers);
  }

  use(...args: any) {
    if (typeof args[0] === 'function') {
      // default route to '/' => add prefix if necessary
      args.unshift(this.getRoute('/'));
    } else {
      // route passed in, add prefix if necessary
      args[0] = this.getRoute(args[0]);
    }
    this.router.use(...args);
  }

  listen(port: number, done: (server: any) => void = server => { }) {
    this.httpServer = this.app.listen(port, () => {
      this.logger.info(`${process.title} listening on http://localhost:${port}`);
      return done(this);
    });
    return this.httpServer;
  }

  routePrefix() {
    return this.config.server.routePrefix;
  }

  getRoute(relativePath: string) {
    return path.join(this.config.server.routePrefix, relativePath);
  }

  close(done: ()=>void = () => { }) {
    this.gateways.close();

    this.httpServer.close(done);
  }
}

function siteURL(cfg: Config): string {
  return '';
}
