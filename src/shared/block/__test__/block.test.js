// @flow
import test from 'ava';
import {
  renderIntoDocument,
  findAllInRenderedTree,
  scryRenderedDOMElementsWithTag, scryRenderedDOMElementsWithClass,
} from 'inferno-test-utils';

import {Block, BlockSummary} from '../block';
import {RootTestComponent} from '../../common/root/root-test-component';

test('Block contains BlockSummary', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <Block
        state = {{
          block: {
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
          executions: {
            fetching: false,
          },
          transfers: {
            fetching: false,
          },
          votes: {
            items: null,
            fetching: false,
            error: null,
          },
          fetching: false,
          error: null,
        }}
        params = {{
          id: '123',
        }}
      />
    </RootTestComponent>
  );
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'BlockSummary'), 'contains BlockSummary');
});

// eslint-disable-next-line max-statements
test('BlockSummary contains attributes', t => {
  const block = {
    id: '123',
    transfers: 0,
    executions: 0,
    height: 1,
    forged: 2,
    amount: 3,
    timestamp: 123,
    size: 1,
    generateBy: {
      name: 'bob',
      address: '123',
    },
  };
  const tree = renderIntoDocument(
    <RootTestComponent>
      <BlockSummary
        id={'123'}
        block={block}
        error={null}
        fetching={false}
        executions={{
          fetching: false,
        }}
        transfers={{
          fetching: false,
        }}
        votes={{
          items: null,
          fetching: false,
          error: null,
        }}
      />
    </RootTestComponent>
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');

  const r1 = trs[1].getElementsByTagName('td');
  t.is(r1[1].textContent, '0', 'contains 0');

  const r2 = trs[2].getElementsByTagName('td');
  t.is(r2[0].textContent, 'meta.height', 'contains meta.height');
  t.is(r2[1].textContent, '1', 'contains 1');

  // const r3 = trs[3].getElementsByTagName('td');
  // t.is(r3[0].textContent, 'block.totalForged', 'contains block.totalForged');
  // t.is(r3[1].textContent, '2', 'contains 2');

  const r4 = trs[3].getElementsByTagName('td');
  t.is(r4[0].textContent, 'block.totalAmount', 'contains block.totalAmount');
  t.is(r4[1].textContent, '3', 'contains 3');

  const r5 = trs[4].getElementsByTagName('td');
  t.is(r5[0].textContent, 'block.size', 'contains block.size');
  t.is(r5[1].textContent, '1', 'contains 1');

  const r6 = trs[5].getElementsByTagName('td');
  t.is(r6[0].textContent, 'meta.timestamp', 'contains meta.timestamp');

  const r7 = trs[6].getElementsByTagName('td');
  t.is(r7[0].textContent, 'block.generatedBy', 'contains block.generatedBy');
  t.is(r7[1].textContent, 'bob', 'contains bob');
});

// eslint-disable-next-line max-statements
test('BlockSummary contains attributes when null', t => {
  const block = {
    id: '123',
    transfers: 0,
    executions: 0,
    height: null,
    forged: null,
    amount: null,
    timestamp: null,
    generateBy: null,
    fetching: false,
  };
  const tree = renderIntoDocument(
    <RootTestComponent>
      <BlockSummary
        id={'123'}
        block={block}
        error={null}
        fetching={false}
        executions={{
          fetching: false,
        }}
        transfers={{
          fetching: false,
        }}
        votes={{
          items: null,
          fetching: false,
          error: null,
        }}
      />
    </RootTestComponent>
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');

  const r1 = trs[2].getElementsByTagName('td');
  t.is(r1[0].textContent, 'meta.height', 'contains meta.height');
  t.is(r1[1].textContent, '0', 'contains 0');

  // const r2 = trs[3].getElementsByTagName('td');
  // t.is(r2[0].textContent, 'block.totalForged', 'contains block.totalForged');
  // t.is(r2[1].textContent, '0', 'contains 0');

  const r3 = trs[3].getElementsByTagName('td');
  t.is(r3[0].textContent, 'block.totalAmount', 'contains block.totalAmount');
  t.is(r3[1].textContent, '0', 'contains 0');

  const r4 = trs[4].getElementsByTagName('td');
  t.is(r4[0].textContent, 'block.size', 'contains block.size');
  t.is(r4[1].textContent, '0', 'contains 0');

  const r5 = trs[5].getElementsByTagName('td');
  t.is(r5[0].textContent, 'meta.timestamp', 'contains meta.timestamp');

  const r6 = trs[6].getElementsByTagName('td');
  t.is(r6[0].textContent, 'block.generatedBy', 'contains block.generatedBy');
  t.is(r6[1].textContent, '', 'contains ');
});

test('BlockSummary error', t => {
  const block = {
    id: '123',
    executions: 0,
    transfers: 0,
    height: null,
    forged: null,
    amount: null,
    timestamp: null,
    generateBy: null,
  };
  const e = {
    code: '1',
    message: {
      code: 'fail',
    },
  };

  const tree = renderIntoDocument(
    <RootTestComponent>
      <BlockSummary
        id={'123'}
        block={block}
        error={e}
        fetching={false}
        transfers={{
          fetching: false,
        }}
        executions={{
          fetching: false,
        }}
        votes={{
          items: null,
          fetching: false,
          error: null,
        }}
      />
    </RootTestComponent>
  );

  const error = scryRenderedDOMElementsWithClass(tree, 'single-col-header');
  t.is(error.length, 1, 'Contains error');
});

test('BlockSummary null block', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <BlockSummary
        id={'123'}
        block={null}
        error={null}
        fetching={false}
        transfers={{
          fetching: false,
        }}
        executions={{
          fetching: false,
        }}
        votes={{
          items: null,
          fetching: false,
          error: null,
        }}
      />
    </RootTestComponent>
  );

  const error = scryRenderedDOMElementsWithClass(tree, 'table');
  t.is(error.length, 0, 'Empty');
});
