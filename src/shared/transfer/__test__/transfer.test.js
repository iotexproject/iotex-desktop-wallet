// @flow
import test from 'ava';
import {
  renderIntoDocument,
  findAllInRenderedTree,
  scryRenderedDOMElementsWithTag,
} from 'inferno-test-utils';

import {Transfer, TransferSummary} from '../transfer';
import {RootTestComponent} from '../../common/root/root-test-component';

test('Transfer contains TransferSummary', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <Transfer
        state={{
          transfer: {
            id: 'id',
            sender: 'sender',
            recipient: 'recipient',
            amount: 123,
            fee: 123,
            timestamp: 123,
            blockId: 'blockId',
          },
          fetching: false,
          error: {
            code: '',
            message: {
              code: '',
            },
          },
        }}
        params={{
          id: 'transferId',
        }}
      />
    </RootTestComponent>
  );
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'TransferSummary'), 'contains TransferSummary');
});

// eslint-disable-next-line max-statements
test('TransferSummary contains attributes', t => {
  const transfer = {
    id: 'id',
    sender: 'sender',
    recipient: 'recipient',
    amount: 123,
    fee: 123,
    timestamp: 123,
    blockId: 'blockId',
  };
  const tree = renderIntoDocument(
    <RootTestComponent>
      <TransferSummary
        transfer={transfer}
        fetching={false}
        id={'123'}
      />
    </RootTestComponent>
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');

  const r2 = trs[1].getElementsByTagName('td');
  t.is(r2[0].textContent, 'transfer.sender', 'contains transfer.sender');
  t.is(r2[1].textContent, 'sender', 'contains sender');

  const r3 = trs[2].getElementsByTagName('td');
  t.is(r3[0].textContent, 'transfer.recipient', 'contains transfer.recipient');
  t.is(r3[1].textContent, 'recipient', 'contains recipient');

  const r4 = trs[3].getElementsByTagName('td');
  t.is(r4[0].textContent, 'meta.amount', 'contains meta.amount');
  t.is(r4[1].textContent, '123', 'contains 123');

  // const r5 = trs[4].getElementsByTagName('td');
  // t.is(r5[0].textContent, 'transfer.fee', 'contains transfer.fee');
  // t.is(r5[1].textContent, '123', 'contains 123');

  const r6 = trs[4].getElementsByTagName('td');
  t.is(r6[0].textContent, 'meta.timestamp', 'contains meta.timestamp');

  const r7 = trs[5].getElementsByTagName('td');
  t.is(r7[0].textContent, 'meta.block', 'contains meta.block');
  t.is(r7[1].textContent, 'blockId', 'contains blockId');
});

// eslint-disable-next-line max-statements
test('TransferSummary sender is blank', t => {
  const transfer = {
    id: 'id',
    sender: '',
    recipient: 'recipient',
    amount: 123,
    fee: 123,
    timestamp: 123,
    blockId: 'blockId',
  };
  const tree = renderIntoDocument(
    <RootTestComponent>
      <TransferSummary
        transfer={transfer}
        fetching={false}
        id={'123'}
      />
    </RootTestComponent>
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');

  const r1 = trs[1].getElementsByTagName('td');
  t.is(r1[0].textContent, 'transfer.sender', 'contains transfer.sender');
  t.is(r1[1].textContent, 'transfer.coinBase', 'contains transfer.coinBase');

  const r2 = trs[2].getElementsByTagName('td');
  t.is(r2[0].textContent, 'transfer.recipient', 'contains transfer.recipient');
  t.is(r2[1].textContent, 'recipient', 'contains recipient');

  const r3 = trs[3].getElementsByTagName('td');
  t.is(r3[0].textContent, 'meta.amount', 'contains meta.amount');
  t.is(r3[1].textContent, '123', 'contains 123');

  // const r4 = trs[4].getElementsByTagName('td');
  // t.is(r4[0].textContent, 'transfer.fee', 'contains transfer.fee');
  // t.is(r4[1].textContent, '123', 'contains 123');

  const r5 = trs[4].getElementsByTagName('td');
  t.is(r5[0].textContent, 'meta.timestamp', 'contains meta.timestamp');

  const r6 = trs[5].getElementsByTagName('td');
  t.is(r6[0].textContent, 'meta.block', 'contains block.title');
  t.is(r6[1].textContent, 'blockId', 'contains blockId');
});

test('TransferSummary null address', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <TransferSummary
        transfer={null}
        fetching={false}
      />
    </RootTestComponent>
  );

  const error = scryRenderedDOMElementsWithTag(tree, 'table');
  t.is(error.length, 1, 'Empty');
});
