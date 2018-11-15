import url from 'url';
import axios from 'axios';
import {WALLET} from '../../shared/common/site-url';

export class CrossChain {
  constructor(chains) {
    this.chains = chains;
  }

  async signAndSettleDeposit({chainId, settleDeposit, wallet}) {
    const chain = this.chains.find(c => c.id === chainId);
    if (!chain) {
      throw new Error(`cannot find registered chain id ${chainId} in config`);
    }
    const base = chain.gatewayUrl || chain.url; // prefer gateway url
    const target = url.resolve(base, WALLET.SIGN_AND_SETTLE_DEPOSIT);
    try {
      const resp = await axios.post(target, {settleDeposit, wallet});
      return resp.data;
    } catch (e) {
      throw new Error(`failed to signAndSettleDeposit to ${target}: ${e.stack}`);
    }
  }
}
