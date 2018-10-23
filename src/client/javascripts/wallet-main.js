import {clientRender} from '../../shared/common/root/client-render';
import {createViewRoutes} from '../../shared/wallet/wallet-view-routes';
import {rootReducer} from '../../shared/common/root/root-reducer';

clientRender({
  vDom: createViewRoutes(),
  reducer: rootReducer,
  clientScript: '/wallet-main.js',
});
