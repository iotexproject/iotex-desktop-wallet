// @flow
import test from 'ava';
import {
  renderIntoDocument,
  findAllInRenderedTree,
  scryRenderedDOMElementsWithTag,
} from 'inferno-test-utils';

import {Blocks, BlocksList, BlocksListOnlyId} from '../blocks';
import {RootTestComponent} from '../../common/root/root-test-component';

test('Blocks contains BlocksList', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <Blocks
        state={{
          blocks: {
            items: [{
              id: '123',
              transfers: 0,
              height: 1,
              forged: 2,
              amount: 3,
              timestamp: 123,
              generateBy: {
                name: 'bob',
                address: '123',
              },
            }, {
              id: '123',
              transfers: 0,
              height: 1,
              forged: 2,
              amount: 3,
              timestamp: 123,
              generateBy: {
                name: 'bob',
                address: '123',
              },
            }],
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
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'BlocksList'), 'contains BlocksList');
});

test('BlocksList contains attributes', t => {
  const blocks = [
    {
      id: '123',
      transfers: 0,
      height: 1,
      forged: 2,
      amount: 3,
      timestamp: 123,
      generateBy: {
        name: 'bob',
        address: '123',
      },
    }, {
      id: '123',
      transfers: 0,
      height: 1,
      forged: 2,
      amount: 3,
      timestamp: 123,
      generateBy: {
        name: 'bob',
        address: '123',
      },
    },
  ];
  const tree = renderIntoDocument(
    <RootTestComponent>
      <BlocksList
        blocks={blocks}
      />
    </RootTestComponent>
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');
  const rows = [];
  trs.map(t => rows.push(t.getElementsByTagName('td')));
  rows.map((r, i) => {
    // check rows with td
    if (i > 0) {
      t.is(r[0].textContent, '123', 'contains 123');
      t.is(r[1].textContent, '1', 'contains 1');
      t.is(r[3].textContent, '0', 'contains 0');
      t.is(r[4].textContent, 'bob', 'contains bob');
      t.is(r[5].textContent, '3', 'contains 3');
      t.is(r[6].textContent, '2', 'contains 2');
    }
  });
});

test('BlocksList not array', t => {
  const blocks = {
    id: '123',
    transfers: 0,
    height: 1,
    forged: 2,
    amount: 3,
    timestamp: 123,
    generateBy: {
      name: 'bob',
      address: '123',
    },
  };

  const tree = renderIntoDocument(
    <RootTestComponent>
      <BlocksList
        blocks={blocks}
      />
    </RootTestComponent>
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');
  const rows = [];
  trs.map(t => rows.push(t.getElementsByTagName('td')));
  rows.map((r, i) => {
    // check rows with td
    if (i > 0) {
      t.is(r[0].textContent, '123', 'contains 123');
      t.is(r[1].textContent, '1', 'contains 1');
      t.is(r[3].textContent, '0', 'contains 0');
      t.is(r[4].textContent, 'bob', 'contains bob');
      t.is(r[5].textContent, '3', 'contains 3');
      t.is(r[6].textContent, '2', 'contains 2');
    }
  });
});

// eslint-disable-next-line max-statements
test('BlocksList null block', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <BlocksList
        blocks={null}
      />
    </RootTestComponent>
  );

  const error = scryRenderedDOMElementsWithTag(tree, 'table');
  t.is(error.length, 1, 'Empty');
});

test('BlocksListOnlyId contains attributes', t => {
  const blocks = [
    {
      id: '123',
      transfers: 0,
      height: 1,
      forged: 2,
      amount: 3,
      timestamp: 123,
      generateBy: {
        name: 'bob',
        address: '123',
      },
    }, {
      id: '123',
      transfers: 0,
      height: 1,
      forged: 2,
      amount: 3,
      timestamp: 123,
      generateBy: {
        name: 'bob',
        address: '123',
      },
    },
  ];
  const tree = renderIntoDocument(
    <RootTestComponent>
      <BlocksListOnlyId
        blocks={blocks}
      />
    </RootTestComponent>
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');
  const rows = [];
  trs.map(t => rows.push(t.getElementsByTagName('td')));
  rows.map((r, i) => {
    // check rows with td
    if (i > 0) {
      t.is(r[0].textContent, '123', 'contains 123');
    }
  });
});

test('BlocksListOnlyId not array', t => {
  const blocks = {
    id: '123',
    transfers: 0,
    height: 1,
    forged: 2,
    amount: 3,
    timestamp: 123,
    generateBy: {
      name: 'bob',
      address: '123',
    },
  };

  const tree = renderIntoDocument(
    <RootTestComponent>
      <BlocksListOnlyId
        blocks={blocks}
      />
    </RootTestComponent>
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');
  const rows = [];
  trs.map(t => rows.push(t.getElementsByTagName('td')));
  rows.map((r, i) => {
    // check rows with td
    if (i > 0) {
      t.is(r[0].textContent, '123', 'contains 123');
    }
  });
});

test('BlocksListOnlyId null block', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <BlocksListOnlyId
        blocks={null}
      />
    </RootTestComponent>
  );

  const error = scryRenderedDOMElementsWithTag(tree, 'table');
  t.is(error.length, 0, 'Empty');
});
