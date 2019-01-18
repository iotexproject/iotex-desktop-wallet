import {noopReducer} from 'onefx/lib/iso-react-render/root/root-reducer';
import {clientReactRender} from 'onefx/lib/iso-react-render/client-react-render';
import {IdentityAppContainer} from './view/identity-app-container';

clientReactRender({
  VDom: (
    <IdentityAppContainer/>
  ),
  reducer: noopReducer,
  clientScript: '/identity-provider-main.js',
});
