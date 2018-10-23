import 'jsdom-global/register';
import Styletron from 'styletron-client';
import {Provider as StyleProvider} from 'styletron-inferno';
import {Provider} from 'inferno-redux';
import {createStore} from 'redux';

export function RootTestComponent({children}) {
  return (
    <Provider store={createStore(() => ({base: {}}))}>
      <StyleProvider styletron={new Styletron()}>
        {children}
      </StyleProvider>
    </Provider>
  );
}
