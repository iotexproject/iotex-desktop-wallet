import {WALLET} from '../../common/site-url';
import {logger} from '../../../lib/integrated-gateways/logger';

export function setContractRoutes(server) {
  const {gateways: {walletCore, iotexCore}} = server;

  function handleInput(args) {
    const errors = [];
    let ok = true;

    Object.keys(args).forEach(key => {
      if (args[key] === undefined || args[key] === '') {
        errors.push(key);
        ok = false;
      }
    });

    return {ok, errors};
  }

  async function generateExecution(ctx, next) {
    const {rawSmartContractRequest, wallet} = ctx.request.body;
    delete rawSmartContractRequest.contract;
    const formCheck = handleInput(rawSmartContractRequest);

    if (formCheck.errors.length > 0) {
      ctx.body = formCheck;
      return;
    }

    // Generate transaction details
    try {
      const address = await iotexCore.getAddressDetails(wallet.rawAddress);
      if (rawSmartContractRequest.nonce <= address.nonce) {
        ctx.body = {
          ok: false,
          error: {code: 'NONCE_TOO_LOW', message: 'input.error.nonceTooLow'},
        };
        return;
      }

      ctx.body = {
        ok: true,
        rawTransaction: await walletCore.signSmartContract(wallet, rawSmartContractRequest),
      };
    } catch (error) {
      logger.error('FAIL_GENERATE_CONTRACT', error);
      ctx.body = {ok: false, error: {code: 'FAIL_GENERATE_CONTRACT', message: 'wallet.error.failSignContract'}};
    }
  }

  async function signContractAbi(ctx, next) {
    const {rawTransaction, wallet} = ctx.request.body;
    const formCheck = handleInput(rawTransaction);

    if (formCheck.errors.length > 0) {
      ctx.body = formCheck;
      return;
    }

    // Generate transaction details
    try {
      const address = await iotexCore.getAddressDetails(wallet.rawAddress);
      if (rawTransaction.nonce <= address.nonce) {
        ctx.body = {
          ok: false,
          error: {code: 'NONCE_TOO_LOW', message: 'input.error.nonceTooLow'},
        };
        return;
      }

      ctx.body = {
        ok: true,
        rawTransaction: await walletCore.signSmartContract(wallet, rawTransaction),
      };
    } catch (error) {
      logger.error('FAIL_SIGN_ABI', error);
      ctx.body = {ok: false, error: {code: 'FAIL_SIGN_ABI', message: 'wallet.error.failSignContract'}};
    }
  }

  async function readExecution(ctx, next) {
    const {rawTransaction} = ctx.request.body;

    try {
      ctx.body = {
        ok: true,
        result: await iotexCore.readExecutionState(rawTransaction),
      };
    } catch (error) {
      logger.error('FAIL_READ_EXECUTION', error);
      ctx.body = {ok: false, error: {code: 'FAIL_READ_EXECUTION', message: 'wallet.error.failReadExecution'}};
    }
  }

  server.post('generate execution', WALLET.GENERATE_EXECUTION, generateExecution);
  server.post('generate abi transaction', WALLET.SIGN_CONTRACT_ABI, signContractAbi);
  server.post('read execution', WALLET.READ_EXECUTION, readExecution);
}
