import test from 'ava';
import {CrossChain} from '../cross-chains';

test.skip('crosschain signAndSettleDeposit', async t => {
  const s = new CrossChain([
    {
      id: 1,
      name: 'mainchain',
      url: 'http://localhost:4004/',
    },
    {
      id: 2,
      name: 'subchain',
      url: 'http://localhost:4005/',
    }]);
  const resp = await s.signAndSettleDeposit({
    chainId: 2,
    settleDeposit: {
      nonce: 7,
      signature: 'e93edf28edd3fdc861d6ad253e23a55269e3fb0f36124281aa87e1fd88e59ac5b2e3bc006475914af07307899a73188b48d3781d465b98d92593fa2e8399326403dab750322fae00',
      amount: '1',
      sender: 'io1qyqsqqqqtjwyzadu20qekmyt7fv83wqr8efzd98c4r0z0x',
      recipient: 'io1qypqqqqqtjwyzadu20qekmyt7fv83wqr8efzd98cgmjn3l',
      gasLimit: 1000000,
      gasPrice: '0',
      version: 1,
      senderPubKey: '6bec6205932bc5be8430ab094b4456dc5c3d4325bcfd6cc3365ca1ad0ca7e66cf8d3c70088761402e0de42fa88e892a3cf22fdbd493f68284e6209597ef87afb6d8aad09b0795006',
      index: 6,
    },
    wallet: {
      publicKey: '6bec6205932bc5be8430ab094b4456dc5c3d4325bcfd6cc3365ca1ad0ca7e66cf8d3c70088761402e0de42fa88e892a3cf22fdbd493f68284e6209597ef87afb6d8aad09b0795006',
      privateKey: '574f3b95c1afac4c5541ce705654bd92028e6b06bc07655647dd2637528dd98976f0c401',
      rawAddress: 'io1qyqsqqqqtjwyzadu20qekmyt7fv83wqr8efzd98c4r0z0x',
    },
  }
  );
  t.truthy(resp.hash);
});
