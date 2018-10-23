// @flow
import test from 'ava';
import {
  renderIntoDocument,
  findAllInRenderedTree,
} from 'inferno-test-utils';

import {RootTestComponent} from '../../common/root/root-test-component';
import {Wallet} from '../wallet';

test('Wallet contains AccountSection', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <Wallet
        showMessage={null}
      />
    </RootTestComponent>
  );
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'AccountSection'), 'contains AccountSection');
});
