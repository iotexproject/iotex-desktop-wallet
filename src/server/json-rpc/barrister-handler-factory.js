import Barrister from 'barrister';
import {logger} from '../../lib/integrated-gateways/logger';

export class BarristerAdapter {
  constructor(service) {
    const self = this;

    // copy methods in proto
    const proto = Object.getPrototypeOf(service);
    const interfaceName = proto.constructor.name;
    Object.getOwnPropertyNames(proto).forEach(k => {
      if (k !== 'constructor') {
        const asyncFunc = proto[k];

        self[k] = (...args) => {
          const callback = args[args.length - 1];
          const params = args.slice(0, args.length - 1);
          asyncFunc.bind(service)(...params)
            .then(result => callback(null, result))
            .catch(err => {
              if (err.code) {
                return callback(err, null);
              }
              logger.error(`failed to call ${interfaceName}.${k}`, err);
              callback({code: -32603, message: 'UNKNOWN_ERROR_SERVER'}, null);
            });
        };
      }
    });

    // copy properties
    Object.keys(service).forEach(p => {
      self[p] = service[p];
    });
  }
}

export function barristerHandlerFactory({service, idlJson, name}) {
  const jsonRpcService = new Barrister.Server(idlJson);
  jsonRpcService.addHandler(name, new BarristerAdapter(service));

  return async(ctx, next) => {
    await new Promise((resolve, reject) => {
      jsonRpcService.handle({}, ctx.request.body, respJson => {
        ctx.response.body = respJson;
        resolve();
      });
    });
    await next();
  };
}
