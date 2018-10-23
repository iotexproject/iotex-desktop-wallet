// @flow
import {logger} from '../../lib/integrated-gateways/logger';

class ServiceError extends Error {
  code: any;
  message: string;

  constructor(code, message) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

export class RpcService {
  server: any;
  iotexCore: any;
  walletCore: any;

  constructor(server: any) {
    this.server = server;
    this.iotexCore = this.server.gateways.iotexCore;
    this.walletCore = this.server.gateways.walletCore;
  }

  async getAddressId(req: any) {
    return await this.iotexCore.getAddressDetails(req.id);
  }

  async signContractAbi(req: any) {
    const address = await this.iotexCore.getAddressDetails(req.wallet.rawAddress);
    if (req.rawTransaction.nonce <= address.nonce) {
      throw new ServiceError(-32600, 'NONCE_TOO_LOW');
    }
    try {
      const signedTransaction = await this.walletCore.signSmartContract(req.wallet, req.rawTransaction);
      return {
        signedTransaction,
      };
    } catch (error) {
      logger.error('FAIL_SIGN_ABI', error);
      throw new ServiceError(-32600, 'FAIL_SIGN_ABI');
    }
  }

  async sendTransaction(req: any) {
    const {signedTransaction, type} = req;
    try {
      let result;
      if (type === 'transfer') {
        result = await this.iotexCore.sendTransfer(signedTransaction);
      } else if (type === 'vote') {
        result = await this.iotexCore.sendVote(signedTransaction);
      } else {
        result = await this.iotexCore.sendSmartContract(signedTransaction);
      }
      return {
        hash: result.hash,
      };
    } catch (error) {
      logger.error('FAIL_SEND_TRANSACTION', error);
      throw new ServiceError(-32600, 'FAIL_SEND_TRANSACTION');
    }
  }

  async getReceiptByExecutionId(req: any) {
    try {
      return await this.iotexCore.getReceiptByExecutionId(req);
    } catch (error) {
      logger.error('FAIL_GET_RECEIPT', error);
      throw new ServiceError(-32600, 'FAIL_GET_RECEIPT');
    }
  }

  async readExecutionState(req: any) {
    try {
      return await this.iotexCore.readExecutionState(req);
    } catch (error) {
      logger.error('FAIL_READ_EXECUTION_STATE', error);
      throw new ServiceError(-32600, 'FAIL_READ_EXECUTION_STATE');
    }
  }
}
