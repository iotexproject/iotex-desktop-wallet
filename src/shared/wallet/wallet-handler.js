/* eslint-disable max-statements */
import config from 'config';
import {rootReducer} from '../common/root/root-reducer';
import {WALLET} from '../common/site-url';
import {logger} from '../../lib/integrated-gateways/logger';
import {createViewRoutes} from './wallet-view-routes';
import {intFromHexLE} from './transfer/int-from-hex';

function handleInput(args) {
  const errors = [];
  let ok = true;

  Object.keys(args).forEach(key => {
    if (key !== 'payload' && (args[key] === undefined || args[key] === '')) {
      errors.push(key);
      ok = false;
    }
  });

  return {ok, errors};
}

export function setWalletRoutes(server) {
  const {gateways: {walletCore, iotexCore, crossChain, iotxRpcMethods}} = server;

  function walletHandler(ctx, next) {
    ctx.isoRender({
      vDom: createViewRoutes(server.routePrefix()),
      reducer: rootReducer,
      clientScript: '/wallet-main.js',
    });
  }

  async function generateKeyPair(ctx, next) {
    const {chainId} = ctx.request.body;
    try {
      ctx.body = {
        ok: true,
        wallet: await walletCore.generateWallet(chainId),
      };
    } catch (error) {
      logger.error('FAIL_GENERATE_KEY_PAIR', error.stack);
      ctx.body = {ok: false, error: {code: 'FAIL_GENERATE_KEY_PAIR', message: error}};
    }
  }

  async function unlockWallet(ctx, next) {
    const {priKey, chainId} = ctx.request.body;

    try {
      ctx.body = {
        ok: true,
        wallet: await walletCore.unlockWallet(priKey, chainId),
      };
    } catch (error) {
      logger.error('FAIL_UNLOCK_WALLET', error);
      ctx.body = {ok: false, error: {code: 'FAIL_UNLOCK_WALLET', message: error}};
    }
  }

  async function generateTransfer(ctx, next) {
    const {wallet, rawTransfer, isCrossChainTransfer} = ctx.request.body;
    const errors = handleInput(rawTransfer);

    if (!errors.ok) {
      ctx.body = errors;
      return;
    }

    try {
      const address = await iotexCore.getAddressDetails(wallet.rawAddress);
      if (rawTransfer.nonce <= address.nonce) {
        ctx.body = {
          ok: false,
          error: {code: 'NONCE_TOO_LOW', message: 'input.error.nonceTooLow'},
        };
        return;
      }

      let rawTransaction;
      if (isCrossChainTransfer) {
        const createDeposit = {
          amount: rawTransfer.amount,
          sender: rawTransfer.sender,
          recipient: rawTransfer.recipient,
          gasLimit: rawTransfer.gasLimit,
          gasPrice: rawTransfer.gasPrice,
          version: rawTransfer.version,
          senderPubKey: wallet.publicKey,
          nonce: rawTransfer.nonce,
        };
        const resp = await walletCore.signCreateDeposit({createDeposit, address: wallet});
        rawTransaction = resp && resp.createDeposit;
      } else {
        rawTransaction = await walletCore.signTransfer(wallet, rawTransfer);
      }

      ctx.body = {
        ok: true,
        rawTransaction,
      };
    } catch (error) {
      logger.error('FAIL_SIGN_TRANSFER', error);
      ctx.body = {ok: false, error: {code: 'FAIL_SIGN_TRANSFER', message: 'wallet.error.failSignTransfer'}};
    }
  }

  async function generateVote(ctx, next) {
    const {wallet, rawVote} = ctx.request.body;
    const errors = handleInput(rawVote);

    if (!errors.ok) {
      ctx.body = errors;
      return;
    }

    try {
      const address = await iotexCore.getAddressDetails(wallet.rawAddress);
      if (rawVote.nonce <= address.nonce) {
        ctx.body = {
          ok: false,
          error: {code: 'NONCE_TOO_LOW', message: 'input.error.nonceTooLow'},
        };
        return;
      }

      ctx.body = {
        ok: true,
        rawTransaction: await walletCore.signVote(wallet, rawVote),
      };
    } catch (error) {
      logger.error('FAIL_SIGN_VOTE', error);
      ctx.body = {ok: false, error: {code: 'FAIL_SIGN_VOTE', message: 'wallet.error.failSignVote'}};
    }
  }

  async function sendTransaction(ctx, next) {
    const {rawTransaction, type, isCrossChainTransfer} = ctx.request.body;
    try {
      let result;
      switch (type) {
      case 'transfer':
        if (isCrossChainTransfer) {
          result = await iotxRpcMethods.createDeposit(rawTransaction);
        } else {
          result = await iotxRpcMethods.sendTransfer(rawTransaction);
        }
        break;
      case 'vote':
        result = await iotexCore.sendVote(rawTransaction);
        break;
      default:
        result = await iotexCore.sendSmartContract(rawTransaction);
        break;
      }
      ctx.body = {
        ok: true,
        hash: result.hash,
      };
    } catch (error) {
      logger.error('FAIL_SEND_TRANSACTION', error);
      ctx.body = {ok: false, error: {code: 'FAIL_SEND_TRANSACTION', message: 'wallet.error.sendTransaction'}};
    }
  }

  async function continueDeposit(ctx, next) {
    const {targetChainId, hash, rawTransaction} = ctx.request.body;
    const settlerWallet = config.get('settlerWallet');
    const {returnValue} = await iotxRpcMethods.getReceiptByExecutionID(hash);
    const index = intFromHexLE(returnValue);
    const settleDeposit = {
      ...rawTransaction,
      sender: settlerWallet.rawAddress,
      senderPubKey: settlerWallet.publicKey,
      index,
    };
    ctx.response.body = await crossChain.signAndSettleDeposit({chainId: targetChainId, settleDeposit, wallet: settlerWallet});
  }

  async function signAndSettleDeposit(ctx, next) {
    const {settleDeposit, wallet} = ctx.request.body;
    let resp = await walletCore.signSettleDeposit({settleDeposit, address: wallet});
    if (!resp || !resp.settleDeposit) {
      return ctx.response.body = {ok: false, error: {code: 'FAIL_SETTLE_DEPOSIT', message: 'failed to settle deposit'}};
    }
    resp = await iotxRpcMethods.settleDeposit(resp.settleDeposit);
    ctx.response.body = resp;
  }

  server.get('wallet', WALLET.INDEX, walletHandler);
  server.post('generate key pair', WALLET.GENERATE_KEY_PAIR, generateKeyPair);
  server.post('unlock wallet', WALLET.UNLOCK_WALLET, unlockWallet);
  server.post('generate transfer', WALLET.GENERATE_TRANSFER, generateTransfer);
  server.post('generate vote', WALLET.GENERATE_VOTE, generateVote);
  server.post('send transaction', WALLET.SEND_TRANSACTION, sendTransaction);
  server.post('continue deposit', WALLET.CONTINUE_DEPOSIT, continueDeposit);
  server.post('sign and settle deposit', WALLET.SIGN_AND_SETTLE_DEPOSIT, signAndSettleDeposit);
}
