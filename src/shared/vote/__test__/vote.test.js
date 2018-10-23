// @flow
import test from 'ava';
import {
  renderIntoDocument,
  findAllInRenderedTree,
  scryRenderedDOMElementsWithTag,
} from 'inferno-test-utils';

import {RootTestComponent} from '../../common/root/root-test-component';
import {Vote, VoteSummary} from '../vote';

test('Vote contains VoteSummary', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <Vote
        state={{
          vote: {
            id: '123',
            timestamp: '123',
          },
          fetching: false,
          error: null,
        }}
        params={{
          id: 'transferId',
        }}
      />
    </RootTestComponent>
  );
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'VoteSummary'), 'contains VoteSummary');
});

// eslint-disable-next-line max-statements
test('VoteSummary contains attributes', t => {
  const vote = {
    id: '123',
    timestamp: '123',
  };

  const tree = renderIntoDocument(
    <RootTestComponent>
      <VoteSummary
        vote={vote}
        id={'123'}
      />
    </RootTestComponent>
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');

  const r1 = trs[2].getElementsByTagName('td');
  t.is(r1[0].textContent, 'meta.timestamp', 'contains transfer.timestamp');

});

test('VoteSummary null address', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <VoteSummary
        vote={null}
        fetching={false}
      />
    </RootTestComponent>
  );

  const error = scryRenderedDOMElementsWithTag(tree, 'table');
  t.is(error.length, 1, 'Empty');
});

test('VoteSummary error', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <VoteSummary
        vote={null}
        fetching={false}
        error={{
          code: '123',
          message: {
            code: '123',
          },
        }}
      />
    </RootTestComponent>
  );

  const error = scryRenderedDOMElementsWithTag(tree, 'table');
  t.is(error.length, 1, 'Empty');
});

test('VoteSummary error', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <VoteSummary
        vote={null}
        fetching={false}
        error={{
          code: '123',
          message: '123',
        }}
      />
    </RootTestComponent>
  );

  t.truthy(findAllInRenderedTree(tree, n => n.type === 'ErrorMessage'), 'contains ErrorMessage');
});

test('VoteSummary loading', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <VoteSummary
        vote={null}
        fetching={true}
        error={null}
      />
    </RootTestComponent>
  );

  t.truthy(findAllInRenderedTree(tree, n => n.type === 'LoadingMessage'), 'contains LoadingMessage');
});
