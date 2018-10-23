import {clientRender} from '../../shared/common/root/client-render';
import {createViewRoutes} from '../../shared/view-routes';
import {rootReducer} from '../../shared/common/root/root-reducer';

clientRender({
  vDom: createViewRoutes(),
  reducer: rootReducer,
  clientScript: '/main.js',
});
