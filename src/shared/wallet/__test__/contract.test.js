// @flow
import test from 'ava';
import rewire from 'rewire';
import {
  renderIntoDocument,
  findAllInRenderedTree,
} from 'inferno-test-utils';

import {RootTestComponent} from '../../common/root/root-test-component';
import {Contract} from '../contract/contract';
import {Deploy} from '../contract/deploy';
import {Interact} from '../contract/interact';

test('Contract contains AccountSection', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <Contract
        wallet={null}
        setWallet={null}
        showMessage={null}
      />
    </RootTestComponent>
  );
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'AccountSection'), 'contains AccountSection');
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'Deploy'), 'contains Deploy');
});

test('Deploy contains TransactionDetailSection', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <Deploy
        wallet={null}
        setWallet={null}
        showMessage={null}
      />
    </RootTestComponent>
  );
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'TransactionDetailSection'), 'contains TransactionDetailSection');
});

test('Deploy generateAbiAndByteCode', t => {
  const deploy = new Deploy();

  // empty solidity
  deploy.setState = state => t.deepEqual(state.errors_solidity, 'wallet.missing_solidity_pragma');
  deploy.generateAbiAndByteCode();

  // wrong version
  deploy.state.solidity = 'pragma solidity ^0.4.23;contract x { function g() {} }';
  deploy.setState = state => t.deepEqual(state.errors_solidity, 'wallet.cannot_find_solidity_version');
  deploy.generateAbiAndByteCode();
});

test('Deploy generateAbiAndByteCode compile error', t => {
  const module = rewire('../contract/deploy');
  module.__set__({
    window: {
      soljsonReleases: {'0.4.23': 'release'},
      BrowserSolc: {
        loadVersion(release, cb) {
          t.deepEqual('release', release, 'release version');
          cb({
            compile() {
              return {errors: ['123']};
            },
          });
        },
      },
    },
  });
  const deploy = new module.Deploy();

  deploy.state.solidity = 'pragma solidity ^0.4.23;contract x { function g() {} }';
  deploy.setState = state => t.deepEqual(state.errors_solidity, JSON.stringify(['123'], null, 2));
  deploy.generateAbiAndByteCode();
});

test('Deploy contains TransactionDetailSection', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <Interact
        wallet={null}
        setWallet={null}
        showMessage={null}
      />
    </RootTestComponent>
  );
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'TextInputField'), 'contains TextInputField');
});
