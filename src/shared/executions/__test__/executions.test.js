// @flow
import test from 'ava';
import {
  renderIntoDocument,
  findAllInRenderedTree,
  scryRenderedDOMElementsWithTag,
} from 'inferno-test-utils';

import {Executions, ExecutionsList, ExecutionsListOnlyId} from '../executions';
import {RootTestComponent} from '../../common/root/root-test-component';

test('Executions contains ExecutionsList', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <Executions
        state={{
          execution: {
            items: [
              {
                id: '1',
                executor: '1',
                contract: '1',
                amount: 1,
                gas: 1,
                timestamp: '1',
                blockId: '1',
              },
              {
                id: '2',
                executor: '2',
                contract: '2',
                amount: 2,
                gas: 2,
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
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'TransersList'), 'contains ExecutionsList');
});

test('ExecutionsList contains attributes', t => {
  const executions = [
    {
      id: 'id_1',
      executor: 's_1',
      contract: 'r_1',
      amount: 1,
    },
    {
      id: 'id_2',
      executor: 's_2',
      contract: 'r_2',
      amount: 2,
    },
  ];
  const tree = renderIntoDocument(
    <ExecutionsList
      executions={executions}
    />
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

test('ExecutionsList has blank executor', t => {
  const executions = [
    {
      id: 'id_1',
      executor: '',
      contract: 'r_1',
      amount: 1,
    },
    {
      id: 'id_2',
      executor: '',
      contract: 'r_2',
      amount: 2,
    },
  ];
  const tree = renderIntoDocument(
    <ExecutionsList
      executions={executions}
    />
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');
  const rows = [];
  trs.map(t => rows.push(t.getElementsByTagName('td')));
  rows.map((r, i) => {
    // check rows with td
    if (i > 0) {
      t.is(r[0].textContent, `id_${i}`, `contains id_${i}`);
      t.is(r[1].textContent, '', 'does not contain execution.contract');
      t.is(r[2].textContent, `r_${i}`, `contains r_${i}`);
      t.is(r[3].textContent, `${i}`, `contains ${i}`);
    }
  });
});

test('ExecutionsList not array', t => {
  const executions = {
    id: 'id_1',
    executor: 's_1',
    contract: 'r_1',
    amount: 1,
  };

  const tree = renderIntoDocument(
    <ExecutionsList
      executions={executions}
    />
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

test('ExecutionsListOnlyId contains attributes', t => {
  const executions = [
    {
      id: 'id_1',
      executor: 's_1',
      contract: 'r_1',
      amount: 1,
    },
    {
      id: 'id_2',
      executor: 's_2',
      contract: 'r_2',
      amount: 2,
    },
  ];
  const tree = renderIntoDocument(
    <ExecutionsListOnlyId
      executions={executions}
    />
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

test('ExecutionsListOnlyId contains one item', t => {
  const executions = {
    id: 'id_1',
    executor: 's_1',
    contract: 'r_1',
    amount: 1,
  };
  const tree = renderIntoDocument(
    <ExecutionsListOnlyId
      executions={executions}
    />
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
