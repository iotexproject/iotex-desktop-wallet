// @flow
import test from 'ava';

import {cleanPath, notClickablePath} from '../breadcrumbs';

test('Test cleanPath', t => {
  const emptyPath = cleanPath('/');
  t.is(emptyPath[0].address, '', '/ path => [home]');

  const twoItems = cleanPath('/address');
  t.is(twoItems[0].address, '', '/address first item is home');
  t.is(twoItems[1].address, 'address', '/address second item is address');

  const threeItems = cleanPath('/address/123');
  t.is(threeItems[0].address, '', '/address/123 first item is home');
  t.is(threeItems[1].address, 'address', '/address/123 second item is address');
  t.is(threeItems[2].address, '123', '/address/123 third item is 123');
});

test('Test notClickablePath', t => {
  const home = notClickablePath('home');
  t.is(home, false, 'home is clickable');

  const address = notClickablePath('address');
  t.is(address, true, 'address is not clickable');
});
