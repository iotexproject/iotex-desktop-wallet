// @flow
import test from 'ava';
import {
  renderIntoDocument,
  findAllInRenderedTree,
} from 'inferno-test-utils';

import {RootTestComponent} from '../../common/root/root-test-component';
import {Transfer} from '../transfer/transfer';
import {VoteInput} from '../vote/vote-input';

test('Contract contains AccountSection', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <Transfer
        wallet={null}
        setWallet={null}
        showMessage={null}
      />
    </RootTestComponent>
  );
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'AccountSection'), 'contains AccountSection');
});

test('Tool section with null wallet', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <VoteInput
        wallet={null}
      />
    </RootTestComponent>
  );
  t.truthy(findAllInRenderedTree(tree, n => n.type !== 'TextInputField'), 'does contains TextInputField');
});

test('Tool section with wallet', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <VoteInput
        wallet={{}}
      />
    </RootTestComponent>
  );
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'TextInputField'), 'contains TextInputField');
});
