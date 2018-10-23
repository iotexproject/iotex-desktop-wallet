// @flow
import test from 'ava';
import {
  renderIntoDocument,
  findAllInRenderedTree,
  scryRenderedDOMElementsWithTag,
} from 'inferno-test-utils';

import {RootTestComponent} from '../../common/root/root-test-component';
import {Votes, VotesList, VotesListOnlyId} from '../votes';

test('Votes contains VotesList', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <Votes
        state={{
          votes: {
            items: [
              {
                id: '1',
                timestamp: '1',
              },
              {
                id: '2',
                timestamp: '2',
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
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'VotesList'), 'contains VotesList');
});

test('VotesList contains attributes', t => {
  const votes = [
    {
      id: 'id_1',
      timestamp: '123',
      blockID: '123',
    },
    {
      id: 'id_2',
      timestamp: '123',
      blockID: '123',
    },
  ];
  const tree = renderIntoDocument(
    <RootTestComponent>
      <VotesList
        votes={votes}
        width={800}
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

test('VotesList not array', t => {
  const votes = {
    id: 'id_1',
    timestamp: '123',
    blockID: '123',
  };

  const tree = renderIntoDocument(
    <RootTestComponent>
      <VotesList
        votes={votes}
        width={800}
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

test('VotesListOnlyId contains attributes', t => {
  const votes = [
    {
      id: 'id_1',
      timestamp: 's_1',
      blockID: '123',
    },
    {
      id: 'id_2',
      timestamp: 's_2',
      blockID: '123',
    },
  ];
  const tree = renderIntoDocument(
    <RootTestComponent>
      <VotesListOnlyId
        votes={votes}
        width={800}
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

test('VotesListOnlyId contains one item', t => {
  const votes = {
    id: 'id_1',
    timestamp: 1,
    blockID: '123',
  };
  const tree = renderIntoDocument(
    <RootTestComponent>
      <VotesListOnlyId
        votes={votes}
        width={800}
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

test('VotesList empty', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <VotesList
        vote={null}
        fetching={true}
        error={null}
        width={0}
      />
    </RootTestComponent>
  );

  t.truthy(findAllInRenderedTree(tree, n => n.type === 'EmptyMessage'), 'contains EmptyMessage');
});

test('VotesListOnlyId empty', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <VotesListOnlyId
        vote={null}
        fetching={true}
        error={null}
        width={0}
      />
    </RootTestComponent>
  );

  t.truthy(findAllInRenderedTree(tree, n => n.type === 'EmptyMessage'), 'contains EmptyMessage');
});
