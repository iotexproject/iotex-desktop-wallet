// @flow
import test from 'ava';
import {NotFound} from '../not-found';

test('Test Not found', test => {
  test.truthy(NotFound() !== null, 'Not found');
});
