import config from 'config';
import rp from 'request-promise-native';

export function asyncRequest(options, port = null) {
  const actualPort = port || config.server.port;
  const host = config.server.host;
  const prefixedPath = options.path;
  return rp({
    method: options.method || 'GET',
    uri: `http://${host}:${actualPort}${prefixedPath}`,
    resolveWithFullResponse: true,
    followRedirect: false,
    json: options.json,
  });
}
