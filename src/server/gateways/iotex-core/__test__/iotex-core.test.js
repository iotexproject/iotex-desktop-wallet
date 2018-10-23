// @flow
import test from 'ava';
import {fromGTransfer, fromGBlock, fromGVote, isLatest} from '../iotex-core-types';
import type {GTransfer, GBlockGenerator, GBlock, GVote} from '../iotex-core-types';

function getGBlock(): GBlock {
  const bG = {
    name: '123',
    address: '123',
  };

  const gBlockGenerator: GBlockGenerator = {address: '123', ...bG};

  const b = {
    ID: '123',
    height: 1,
    timestamp: 1,
    transfers: 1,
    votes: 1,
    amount: 1,
    forged: 1,
    size: 1,
  };

  return {
    ...b,
    ID: '123',
    generateBy: gBlockGenerator,
  };
}

test('Test GTransfer and GBlock', t => {
  const gT = {
    version: 1,
    ID: '123',
    nonce: 1,
    sender: '123',
    recipient: '123',
    amount: 1,
    senderPubKey: '123',
    signature: 'v',
    payload: 'x',
    isCoinbase: false,
    fee: 1,
    timestamp: 1,
    blockID: '123',
    isPending: false,
  };

  const gTransfer: GTransfer = {...gT, fee: 2};

  const transfer = fromGTransfer(gTransfer);
  t.is(transfer.id, '123', 'id is 123');
  t.is(transfer.blockId, '123', 'blockId is 123');

  const block = fromGBlock(getGBlock());
  t.is(block.id, '123', 'id is 123');
  t.is(block.transfers, 1, 'transfers is 1');

  const gV = {
    version: 1,
    ID: '123',
    nonce: 1,
    timestamp: 1,
    voter: '123',
    votee: '123',
    voterPubKey: '123',
    signature: 'vv',
    blockID: '123',
    isPending: false,
  };

  const gVote: GVote = {...gV, timestamp: 1};
  const vote = fromGVote(gVote);
  t.is(vote.id, '123', 'id is 123');
  t.is(vote.timestamp, 1, 'timestamp is 1');
  t.is(isLatest({ts: Date.now()}), true, 'date is up to date');
});
