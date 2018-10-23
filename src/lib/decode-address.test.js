import test from 'ava';
import {decodeAddress} from './decode-address';

test('test decode address', t => {
  const decoded = decodeAddress('io1qyqsyqcyr04grzdve8pxmfmpap6dh2sdlhadn06a7drfx6');
  t.deepEqual(decoded.address, '1bea8189acc9c26da761e874dbaa0dfdfad9bf5d');
});
