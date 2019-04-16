export const SITE_URL = "/";

export class WALLET {
  static get INDEX(): string {
    return "/wallet";
  }

  static get GENERATE_KEY_PAIR(): string {
    return "/api/wallet/generateKeyPair";
  }

  static get UNLOCK_WALLET(): string {
    return "/api/wallet/unlockWallet";
  }

  static get TRANSACTION(): string {
    return "/wallet/transaction";
  }

  static get CONTRACT(): string {
    return "/wallet/transaction";
  }

  static get GENERATE_TRANSFER(): string {
    return `/api${this.TRANSACTION}/generateTransfer`;
  }

  static get GENERATE_VOTE(): string {
    return `/api${this.TRANSACTION}/generateVote`;
  }

  static get SEND_TRANSACTION(): string {
    return `/api${this.TRANSACTION}/sendTransaction`;
  }

  static get CONTINUE_DEPOSIT(): string {
    return `/api${this.TRANSACTION}/continueDeposit`;
  }

  static get SIGN_AND_SETTLE_DEPOSIT(): string {
    return `/api${this.TRANSACTION}/signSettleDeposit`;
  }

  static get SIGN_CONTRACT_ABI(): string {
    return `/api${this.CONTRACT}/signContractAbi`;
  }

  static get GENERATE_EXECUTION(): string {
    return `/api${this.CONTRACT}/generateExecution`;
  }

  static get READ_EXECUTION(): string {
    return `/api${this.CONTRACT}/readExecution`;
  }
}

export const TRANSFER = {
  INDEX: "/transfers/"
};
