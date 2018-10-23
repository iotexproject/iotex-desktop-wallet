// @flow
import test from 'ava';
import {
  renderIntoDocument,
  findAllInRenderedTree,
  scryRenderedDOMElementsWithTag,
} from 'inferno-test-utils';

import {Execution, ExecutionSummary} from '../execution';
import {RootTestComponent} from '../../common/root/root-test-component';

test('Execution contains ExecutionSummary', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <Execution
        state={{
          execution: {
            id: 'id',
            executor: 'executor',
            contract: 'contract',
            amount: 123,
            gas: 123,
            timestamp: 123,
            blockId: 'blockId',
          },
          fetching: false,
          error: {
            code: 'FAIL',
            message: '',
          },
        }}
        params={{
          id: 'executionId',
        }}
      />
    </RootTestComponent>
  );
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'ExecutionSummary'), 'contains ExecutionSummary');
});

// eslint-disable-next-line max-statements
test('ExecutionSummary contains attributes', t => {
  const execution = {
    id: 'id',
    executor: 'executor',
    contract: 'contract',
    amount: 1,
    gas: 2,
    data: 'data',
    nonce: 3,
    timestamp: 4,
    blockId: 'blockId',
  };
  const tree = renderIntoDocument(
    <ExecutionSummary
      execution={execution}
      fetching={false}
      id={'123'}
    />
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');

  const r2 = trs[1].getElementsByTagName('td');
  t.is(r2[0].textContent, 'execution.executor', 'contains execution.executor');
  t.is(r2[1].textContent, 'executor', 'contains executor');

  const r3 = trs[2].getElementsByTagName('td');
  t.is(r3[0].textContent, 'execution.contract', 'contains execution.contract');
  t.is(r3[1].textContent, 'contract', 'contains contract');

  const r4 = trs[3].getElementsByTagName('td');
  t.is(r4[0].textContent, 'meta.amount', 'contains meta.amount');
  t.is(r4[1].textContent, '1', 'contains 1');

  const r5 = trs[4].getElementsByTagName('td');
  t.is(r5[0].textContent, 'execution.gas', 'contains execution.gas');
  t.is(r5[1].textContent, '2', 'contains 2');

  const r6 = trs[5].getElementsByTagName('td');
  t.is(r6[0].textContent, 'execution.input', 'contains execution.input');
  t.is(r6[1].textContent, 'data', 'contains data');

  const r7 = trs[6].getElementsByTagName('td');
  t.is(r7[0].textContent, 'execution.nonce', 'contains execution.nonce');
  t.is(r7[1].textContent, '3', 'contains 3');

  const r8 = trs[7].getElementsByTagName('td');
  t.is(r8[0].textContent, 'meta.timestamp', 'contains meta.timestamp');

  const r9 = trs[8].getElementsByTagName('td');
  t.is(r9[0].textContent, 'block.title', 'contains block.title');
  t.is(r9[1].textContent, 'blockId', 'contains blockId');
});

// eslint-disable-next-line max-statements
test('ExecutionSummary executor is blank', t => {
  const execution = {
    id: 'id',
    executor: '',
    contract: 'contract',
    amount: 1,
    data: 'data',
    gas: 2,
    nonce: 3,
    timestamp: 4,
    blockId: 'blockId',
  };
  const tree = renderIntoDocument(
    <ExecutionSummary
      execution={execution}
      fetching={false}
      id={'123'}
    />
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');

  const r1 = trs[1].getElementsByTagName('td');
  t.is(r1[0].textContent, 'execution.executor', 'contains execution.executor');
  t.is(r1[1].textContent, '', 'does not contain executor');

  const r2 = trs[2].getElementsByTagName('td');
  t.is(r2[0].textContent, 'execution.contract', 'contains execution.contract');
  t.is(r2[1].textContent, 'contract', 'contains contract');

  const r3 = trs[3].getElementsByTagName('td');
  t.is(r3[0].textContent, 'meta.amount', 'contains meta.amount');
  t.is(r3[1].textContent, '1', 'contains 1');

  const r4 = trs[4].getElementsByTagName('td');
  t.is(r4[0].textContent, 'execution.gas', 'contains execution.gas');
  t.is(r4[1].textContent, '2', 'contains 2');

  const r5 = trs[5].getElementsByTagName('td');
  t.is(r5[0].textContent, 'execution.input', 'contains execution.input');
  t.is(r5[1].textContent, 'data', 'contains data');

  const r6 = trs[6].getElementsByTagName('td');
  t.is(r6[0].textContent, 'execution.nonce', 'contains execution.nonce');
  t.is(r6[1].textContent, '3', 'contains 3');

  const r7 = trs[7].getElementsByTagName('td');
  t.is(r7[0].textContent, 'meta.timestamp', 'contains meta.timestamp');

  const r8 = trs[8].getElementsByTagName('td');
  t.is(r8[0].textContent, 'block.title', 'contains block.title');
  t.is(r8[1].textContent, 'blockId', 'contains blockId');
});

test('ExecutionSummary null address', t => {
  const tree = renderIntoDocument(
    <ExecutionSummary
      execution={null}
      fetching={false}
    />
  );

  const error = scryRenderedDOMElementsWithTag(tree, 'table');
  t.is(error.length, 1, 'Empty');
});
