// @flow
import config from 'config';

import type {Config} from '../server';
import type {Logger} from './logger';
import {createLogger} from './logger';

export class IntegratedGateways {
  logger: Logger;
  config: Config;

  constructor(cfg: Config) {
    this.config = config;

    if (cfg.gateways.logger.enabled) {
      this.initLogger();
    }
  }

  initLogger() {
    this.logger = createLogger();
  }

  close() {
  }
}
