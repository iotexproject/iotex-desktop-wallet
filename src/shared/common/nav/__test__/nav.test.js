// @flow
import test from 'ava';

import {formatBlockHistory} from '../nav-handler';
import {fetchCoinPrice, fetchCoinStatistic} from '../nav-actions';

test('Nav - format block history', t => {

  t.is(formatBlockHistory(0), 0, '0 seconds');
  t.is(formatBlockHistory(14321), '3h 58′41″', '0 seconds');
  t.is(formatBlockHistory(1432100), '16d 13h 48′20″', '0 seconds');
});

test('actions', t => {
  fetchCoinStatistic();
  fetchCoinPrice();
  t.is(null, null, 'handler');
});
