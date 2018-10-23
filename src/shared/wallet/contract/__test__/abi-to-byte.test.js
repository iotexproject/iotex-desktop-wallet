import test from 'ava';
import {encodeArguments, encodeInputData, getHeaderHash} from '../abi-to-byte';

test('encodeArguments', async t => {
  const encoded = encodeArguments(
    [
      {
        name: 'requestId',
        type: 'string',
      },
      {
        name: 'target',
        type: 'address',
      },
    ],
    {
      requestId: '123cfcc',
      target: 'io1qyqsyqcyr04grzdve8pxmfmpap6dh2sdlhadn06a7drfx6',
    }
  );
  t.deepEqual('00000000000000000000000000000000000000000000000000000000000000400000000000000000000000001bea8189acc9c26da761e874dbaa0dfdfad9bf5d00000000000000000000000000000000000000000000000000000000000000073132336366636300000000000000000000000000000000000000000000000000', encoded);
});

test('getHeaderHash', async t => {
  const fn = {
    constant: false,
    inputs: [{name: 'requestId', type: 'string'}],
    name: 'rollAward',
    outputs: [{name: '', type: 'uint256'}],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  };
  const args = [{name: 'requestId', type: 'string'}];
  const hash = getHeaderHash(fn, args);
  t.deepEqual('7341e13c', hash);
});

test('encodeInputData', async t => {
  const abiFunctions = {
    rollAward: {
      constant: false,
      inputs: [{name: 'requestId', type: 'string'}, {name: 'target', type: 'address'}],
      name: 'rollAward',
      outputs: [{name: '', type: 'uint256'}],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    roll: {
      constant: true,
      inputs: [{name: 'requestId', type: 'string'}],
      name: 'roll',
      outputs: [{name: '', type: 'uint256'}],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    deposit: {
      constant: false,
      inputs: [{name: '_id', type: 'bytes32'}],
      name: 'deposit',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
  };
  const fnName = 'rollAward';
  const userInput = {requestId: '123213', target: 'io1qyqsyqcy222ggazmccgf7dsx9m9vfqtadw82ygwhjnxtmx'};
  const encoded = encodeInputData(abiFunctions, fnName, userInput);
  t.deepEqual('1e67bed80000000000000000000000000000000000000000000000000000000000000040000000000000000000000000529484745bc6109f36062ecac4817d6b8ea221d700000000000000000000000000000000000000000000000000000000000000063132333231330000000000000000000000000000000000000000000000000000', encoded);
});
