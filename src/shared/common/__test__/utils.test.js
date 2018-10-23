// @flow
import test from 'ava';

import {ellipsisText, hideColClass, NARROW_WIDTH, NARROW_WIDTH_HOME} from '../utils';

test('Test ellipsisText', t => {
  t.is(ellipsisText('', 100), '', 'test empty string');
  t.is(ellipsisText('hello world', 100), 'hello world', '11 length');
  t.is(ellipsisText('aaaaaaaaaaaaa', 100), 'aaaaaaaaaaaaa', '13 length');
  t.is(ellipsisText('aaaaaaaaaaaaaa', 100), 'aaaaaa...aaaaaa', '14 length');
  t.is(ellipsisText('aaaaaaaaaaaaaa', NARROW_WIDTH_HOME + 1), 'aaaaaaaaaaaaaa', '> NARROW_WIDTH_HOME');
});

test('Test hideColClass', t => {
  t.is(hideColClass(0), false, '0 width');
  t.is(hideColClass(NARROW_WIDTH - 1), false, `${NARROW_WIDTH - 1} width`);
  t.is(hideColClass(NARROW_WIDTH), true, `${NARROW_WIDTH} width`);
  t.is(hideColClass(NARROW_WIDTH + 1), true, `${NARROW_WIDTH + 1} width`);
});
