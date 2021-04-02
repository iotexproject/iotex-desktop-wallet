import BigNumber from "bignumber.js";
import { Account } from "iotex-antenna/lib/account/account";
import {
  getArgTypes,
  getHeaderHash
} from "iotex-antenna/lib/contract/abi-to-byte";
import { Contract } from "iotex-antenna/lib/contract/contract";
import { IRpcMethod } from "iotex-antenna/lib/rpc-method/types";
import { ABI } from "./abi";
import { ERC20, IERC20, IGasEstimation } from "./erc20";

function hexToBytes(hexStr: string): Array<number> {
  const matches = hexStr.match(/^(0x)?([0-9a-fA-F]*)$/);
  if (!matches || matches.length < 3) {
    throw new Error(`Given value "${hexStr}" is not a valid hex string.`);
  }

  const hex = matches[2].length % 2 ? `0${matches[2]}` : matches[2];

  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }

  return bytes;
}

export interface IVita extends IERC20 {
  claim(account: Account, gasPrice: string, gasLimit: string): Promise<string>;
  claimAs(
    owner: string,
    signature: string,
    nonce: BigNumber,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ): Promise<string>;
  claimableAmount(owner: string, callerAddress: string): Promise<BigNumber>;
}

export interface IAuthorizedMessage {
  address: string;
  msg: string;
  sig: string;
  version: string;
}

export class Vita extends ERC20 implements IVita {
  public async claim(account: Account): Promise<string> {
    const { gasLimit } = await this.estimateClaimGas(account);
    return this.executeMethod("claim", account, "1000000", gasLimit, "0");
  }

  public async estimateClaimGas(account: Account): Promise<IGasEstimation> {
    return this.estimateExecutionGas("claim", account, "0");
  }

  public async estimateClaimAsGas(
    owner: string,
    signature: string,
    nonce: BigNumber,
    account: Account
  ): Promise<IGasEstimation> {
    return this.estimateExecutionGas(
      "claimAs",
      account,
      "0",
      owner,
      hexToBytes(signature),
      nonce.toString()
    );
  }

  public async claimAs(
    owner: string,
    signature: string,
    nonce: BigNumber,
    account: Account
  ): Promise<string> {
    const { gasLimit, gasPrice } = await this.estimateClaimAsGas(
      owner,
      signature,
      nonce,
      account
    );
    return this.executeMethod(
      "claimAs",
      account,
      gasPrice,
      gasLimit,
      "0",
      owner,
      hexToBytes(signature),
      nonce.toString()
    );
  }

  public async claimableAmount(
    owner: string,
    callerAddress: string
  ): Promise<BigNumber> {
    const result = await this.readMethod(
      "claimableAmount",
      callerAddress,
      owner
    );
    return new BigNumber(result, 16);
  }

  public static create(address: string, provider: IRpcMethod): Vita {
    const vita = new Vita();
    vita.address = address;
    vita.provider = provider;
    vita.contract = new Contract(ABI, address, {
      provider: provider,
      // @ts-ignore
      signer: provider.signer
    });

    const methods = {};
    // @ts-ignore
    for (const fnName of Object.keys(vita.contract.getABI())) {
      // @ts-ignore
      const fnAbi = vita.contract.getABI()[fnName];
      if (fnAbi.type === "constructor") {
        continue;
      }

      const args = getArgTypes(fnAbi);
      const header = getHeaderHash(fnAbi, args);

      // @ts-ignore
      methods[header] = {
        name: fnName,
        inputsNames: args.map(i => {
          return `${i.name}`;
        }),
        inputsTypes: args.map(i => {
          return `${i.type}`;
        })
      };
    }
    vita.methods = methods;

    return vita;
  }
}
