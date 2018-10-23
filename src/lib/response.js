// @flow
import type {Response as KResponse} from 'koa';

export interface Response extends KResponse {
  setState: (path: string, val: any) => any,
  getState: (path: ?string) => any,
  removeState: (path: string) => boolean,
  deepExtendState: (newState: any) => void,
  isoRender: ({reducer: any, vDom: any, clientScript: string}) => void,
}
