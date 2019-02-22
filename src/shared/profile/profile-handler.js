import {noopReducer} from 'onefx/lib/iso-react-render/root/root-reducer';
import {apolloSSR} from '../common/apollo-ssr';
import {ProfileAppContainer} from './profile-app';

export function setProfileHandler(server) {
  server.get('/profile/*', server.auth.authRequired, async(ctx, next) => {
    ctx.setState('base.userId', ctx.state.userId);
    ctx.body = await apolloSSR(ctx, server.config.apiGatewayUrl, {
      VDom: (
        <ProfileAppContainer/>
      ),
      reducer: noopReducer,
      clientScript: '/profile-main.js',
    });
  });
}
