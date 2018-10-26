import {rootReducer} from '../common/root/root-reducer';
import {WALLET} from '../common/site-url';
import {logger} from '../../lib/integrated-gateways/logger';
import {createViewRoutes} from './wallet-view-routes';

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
  const {gateways: {walletCore, iotexCore}} = server;

  function walletHandler(ctx, next) {
    ctx.isoRender({
      vDom: createViewRoutes(server.routePrefix()),
      reducer: rootReducer,
      clientScript: '/wallet-main.js',
    });
  }

  async function generateKeyPair(ctx, next) {
    try {
      ctx.body = {
        ok: true,
        wallet: await walletCore.generateWallet(),
      };
    } catch (error) {
      logger.error('FAIL_GENERATE_KEY_PAIR', error.stack);
      ctx.body = {ok: false, error: {code: 'FAIL_GENERATE_KEY_PAIR', message: error}};
    }
  }

  async function unlockWallet(ctx, next) {
    const {priKey} = ctx.request.body;

    try {
      ctx.body = {
        ok: true,
        wallet: await walletCore.unlockWallet(priKey),
      };
    } catch (error) {
      logger.error('FAIL_UNLOCK_WALLET', error);
      ctx.body = {ok: false, error: {code: 'FAIL_UNLOCK_WALLET', message: error}};
    }
  }

  async function generateTransfer(ctx, next) {
    const {wallet, rawTransfer} = ctx.request.body;
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

      ctx.body = {
        ok: true,
        rawTransaction: await walletCore.signTransfer(wallet, rawTransfer),
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
    const {rawTransaction, type} = ctx.request.body;
    try {
      const result = type === 'transfer' ?
        await iotexCore.sendTransfer(rawTransaction) :
        (type === 'vote' ?
          await iotexCore.sendVote(rawTransaction) :
          await iotexCore.sendSmartContract(rawTransaction)
        );
      ctx.body = {
        ok: true,
        hash: result.hash,
      };
    } catch (error) {
      logger.error('FAIL_SEND_TRANSACTION', error);
      ctx.body = {ok: false, error: {code: 'FAIL_SEND_TRANSACTION', message: 'wallet.error.sendTransaction'}};
    }
  }

  server.get('wallet', WALLET.INDEX, walletHandler);
  server.get('generate key pair', WALLET.GENERATE_KEY_PAIR, generateKeyPair);
  server.post('unlock wallet', WALLET.UNLOCK_WALLET, unlockWallet);
  server.post('generate transfer', WALLET.GENERATE_TRANSFER, generateTransfer);
  server.post('generate vote', WALLET.GENERATE_VOTE, generateVote);
  server.post('send transaction', WALLET.SEND_TRANSACTION, sendTransaction);
}
