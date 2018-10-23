// @flow
import test from 'ava';
import {
  renderIntoDocument,
  findAllInRenderedTree,
  scryRenderedDOMElementsWithTag,
} from 'inferno-test-utils';

import {Transfers, TransfersList, TransfersListOnlyId} from '../transfers';
import {RootTestComponent} from '../../common/root/root-test-component';

test('Transfers contains TransfersList', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <Transfers
        state={{
          transfer: {
            items: [
              {
                id: '1',
                sender: '1',
                recipient: '1',
                amount: 1,
                fee: 1,
                timestamp: '1',
                blockId: '1',
              },
              {
                id: '2',
                sender: '2',
                recipient: '2',
                amount: 2,
                fee: 2,
                timestamp: '2',
                blockId: '2',
              },
            ],
            fetching: false,
            error: null,
            offset: 0,
            count: 10,
            total: 100,
          },
        }}
      />
    </RootTestComponent>
  );
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'TransersList'), 'contains TransfersList');
});

test('TransfersList contains attributes', t => {
  const transfers = [
    {
      id: 'id_1',
      sender: 's_1',
      recipient: 'r_1',
      amount: 1,
    },
    {
      id: 'id_2',
      sender: 's_2',
      recipient: 'r_2',
      amount: 2,
    },
  ];
  const tree = renderIntoDocument(
    <RootTestComponent>
      <TransfersList
        transfers={transfers}
      />
    </RootTestComponent>
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');
  const rows = [];
  trs.map(t => rows.push(t.getElementsByTagName('td')));
  rows.map((r, i) => {
    // check rows with td
    if (i > 0) {
      t.is(r[0].textContent, `id_${i}`, `contains id_${i}`);
      t.is(r[1].textContent, `s_${i}`, `contains s_${i}`);
      t.is(r[2].textContent, `r_${i}`, `contains r_${i}`);
      t.is(r[3].textContent, `${i}`, `contains ${i}`);
    }
  });
});

test('TransfersList has blank sender', t => {
  const transfers = [
    {
      id: 'id_1',
      sender: '',
      recipient: 'r_1',
      amount: 1,
    },
    {
      id: 'id_2',
      sender: '',
      recipient: 'r_2',
      amount: 2,
    },
  ];
  const tree = renderIntoDocument(
    <RootTestComponent>
      <TransfersList
        transfers={transfers}
      />
    </RootTestComponent>
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');
  const rows = [];
  trs.map(t => rows.push(t.getElementsByTagName('td')));
  rows.map((r, i) => {
    // check rows with td
    if (i > 0) {
      t.is(r[0].textContent, `id_${i}`, `contains id_${i}`);
      t.is(r[1].textContent, 'transfer.coinBase', 'contains transfer.coinBase');
      t.is(r[2].textContent, `r_${i}`, `contains r_${i}`);
      t.is(r[3].textContent, `${i}`, `contains ${i}`);
    }
  });
});

test('TransfersList not array', t => {
  const transfers = {
    id: 'id_1',
    sender: 's_1',
    recipient: 'r_1',
    amount: 1,
  };

  const tree = renderIntoDocument(
    <RootTestComponent>
      <TransfersList
        transfers={transfers}
      />
    </RootTestComponent>
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');
  const rows = [];
  trs.map(t => rows.push(t.getElementsByTagName('td')));
  rows.map((r, i) => {
    // check rows with td
    if (i > 0) {
      t.is(r[0].textContent, `id_${i}`, `contains id_${i}`);
      t.is(r[1].textContent, `s_${i}`, `contains s_${i}`);
      t.is(r[2].textContent, `r_${i}`, `contains r_${i}`);
      t.is(r[3].textContent, `${i}`, `contains ${i}`);
    }
  });
});

test('TransfersListOnlyId contains attributes', t => {
  const transfers = [
    {
      id: 'id_1',
      sender: 's_1',
      recipient: 'r_1',
      amount: 1,
    },
    {
      id: 'id_2',
      sender: 's_2',
      recipient: 'r_2',
      amount: 2,
    },
  ];
  const tree = renderIntoDocument(
    <RootTestComponent>
      <TransfersListOnlyId
        transfers={transfers}
      />
    </RootTestComponent>
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');
  const rows = [];
  trs.map(t => rows.push(t.getElementsByTagName('td')));
  rows.map((r, i) => {
    // check rows with td
    if (i > 0) {
      t.is(r[0].textContent, `id_${i}`, `contains id_${i}`);
    }
  });
});

test('TransfersListOnlyId contains one item', t => {
  const transfers = {
    id: 'id_1',
    sender: 's_1',
    recipient: 'r_1',
    amount: 1,
  };
  const tree = renderIntoDocument(
    <RootTestComponent>
      <TransfersListOnlyId
        transfers={transfers}
      />
    </RootTestComponent>
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');
  const rows = [];
  trs.map(t => rows.push(t.getElementsByTagName('td')));
  rows.map((r, i) => {
    // check rows with td
    if (i > 0) {
      t.is(r[0].textContent, `id_${i}`, `contains id_${i}`);
    }
  });
});
