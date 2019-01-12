import {clientReactRender} from 'onefx/lib/iso-react-render/client-react-render';
import {noopReducer} from 'onefx/lib/iso-react-render/root/root-reducer';
import {ApolloProvider} from 'react-apollo';
import {AppContainer} from '../../shared/app-container';
import {apolloClient} from '../../shared/common/apollo-client';

clientReactRender({
  VDom: (
    <ApolloProvider client={apolloClient}>
      <AppContainer/>
    </ApolloProvider>
  ),
  reducer: noopReducer,
  clientScript: '/main.js',
});
