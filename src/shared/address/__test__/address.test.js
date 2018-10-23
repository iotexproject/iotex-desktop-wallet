// @flow
import test from 'ava';
import {
  renderIntoDocument,
  findAllInRenderedTree,
  scryRenderedDOMElementsWithTag,
  scryRenderedDOMElementsWithClass,
} from 'inferno-test-utils';

import {Address, AddressSummary} from '../address';
import {RootTestComponent} from '../../common/root/root-test-component';

test('Address contains AddressSummary', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <Address
        state = {{
          address: {
            address: '123',
            totalBalance: 123,
          },
          fetching: false,
          error: null,
          transfers: {
            fetching: false,
          },
          voters: {
            fetching: false,
          },
          executions: {
            fetching: false,
          },
        }}
        params = {{
          id: '123',
        }}
      />
    </RootTestComponent>
  );
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'AddressSummary'), 'contains AddressSummary');
});

test('Address contains Votes', t => {
  const tree = renderIntoDocument(
    <RootTestComponent>
      <Address
        state = {{
          address: {
            address: '123',
            totalBalance: 123,
          },
          transfers: {
            fetching: false,
          },
          error: null,
          voters: {
            items: [
              {
                id: 'hello',
                timestamp: 0,
              },
            ],
          },
          executions: {
            fetching: false,
          },
        }}
        params = {{
          id: '123',
        }}
        fetchAddressId={''}
        fetchAddressTransfersId={''}
        fetchAddressVotersId={''}
        width={0}
      />
    </RootTestComponent>
  );
  t.truthy(findAllInRenderedTree(tree, n => n.type === 'Votes'), 'contains Votes');
});

// eslint-disable-next-line max-statements
test('AddressSummary contains attributes', t => {
  const state = {
    address: {
      address: '123',
      totalBalance: 123,
    },
    error: null,
    transfers: {
      items: null,
      fetching: false,
      error: null,
    },
    voters: {
      items: null,
      fetching: false,
      error: null,
    },
    executions: {
      items: null,
      fetching: false,
      error: null,
    },
  };
  const tree = renderIntoDocument(
    <RootTestComponent>
      <AddressSummary
        id={'123'}
        state={state}
        fetchAddressId={'123'}
        fetchAddressTransfersId={'123'}
      />
    </RootTestComponent>
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');

  const r2 = trs[1].getElementsByTagName('td');
  t.is(r2[0].textContent, 'address.totalBalance', 'contains address.totalBalance');
  t.is(r2[1].textContent, '123', 'contains 123');
});

// eslint-disable-next-line max-statements
test('AddressSummary contains attributes when null', t => {
  const state = {
    address: {
      address: null,
      totalBalance: null,
    },
    error: null,
    transfers: {
      items: null,
      fetching: false,
      error: null,
    },
    voters: {
      items: null,
      fetching: false,
      error: null,
    },
    executions: {
      items: null,
      fetching: false,
      error: null,
    },
  };
  const tree = renderIntoDocument(
    <RootTestComponent>
      <AddressSummary
        id={'123'}
        state={state}
        fetchAddressId={'123'}
        fetchAddressTransfersId={'123'}
      />
    </RootTestComponent>
  );

  const trs = scryRenderedDOMElementsWithTag(tree, 'tr');

  const r1 = trs[0].getElementsByTagName('td');
  t.is(r1[0].textContent, 'address.totalBalance', 'contains address.totalBalance');
  t.is(r1[1].textContent, '0', 'contains 0');

  const r2 = trs[1].getElementsByTagName('td');
  t.is(r2[0].textContent, 'address.nonce', 'contains address.nonce');
  t.is(r2[1].textContent, '0', 'contains 0');
});

// eslint-disable-next-line max-statements
test('AddressSummary error', t => {
  const state = {
    address: {
      address: '123',
      totalBalance: 123,
    },
    error: {
      code: '1',
      message: {
        code: 'fail',
      },
    },
    transfers: {
      items: null,
      fetching: false,
      error: null,
    },
    voters: {
      items: null,
      fetching: false,
      error: null,
    },
    executions: {
      items: null,
      fetching: false,
      error: null,
    },
  };
  const tree = renderIntoDocument(
    <RootTestComponent>
      <AddressSummary
        id={'123'}
        state={state}
        fetchAddressId={'123'}
        fetchAddressTransfersId={'123'}
      />
    </RootTestComponent>
  );

  const error = scryRenderedDOMElementsWithClass(tree, 'single-col-header');
  t.is(error.length, 1, 'Contains error');
});

test('AddressSummary null address', t => {
  const state = {
    address: null,
    error: null,
    transfers: {
      items: null,
      fetching: false,
      error: null,
    },
    voters: {
      items: null,
      fetching: false,
      error: null,
    },
    executions: {
      items: null,
      fetching: false,
      error: null,
    },
  };
  const tree = renderIntoDocument(
    <RootTestComponent>
      <AddressSummary
        id={'123'}
        state={state}
        fetchAddressId={'123'}
        fetchAddressTransfersId={'123'}
      />
    </RootTestComponent>
  );

  const error = scryRenderedDOMElementsWithTag(tree, 'table');
  t.is(error.length, 1, 'Empty');
});
