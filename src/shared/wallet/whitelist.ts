import { fromRau } from "iotex-antenna/lib/account/utils";
import { Envelop } from "iotex-antenna/lib/action/envelop";
import { IExecution, ITransfer } from "iotex-antenna/lib/rpc-method/types";

import { numberWithCommas } from "../common/vertical-table";
import { xconf, XConfKeys } from "../common/xconf";
import { decode } from "./decode-contract-data";
import { getAntenna } from "./get-antenna";

export interface DataSource {
  address: string;
  limit: string;
  price: string;
  amount: string;
  dataInHex: string;
  toAddress?: string;
  toContract?: string;
  method: string;
}

export function getDataSource(
  envelop: Envelop,
  fromAddress: string,
  // tslint:disable-next-line: no-any
  abi: { [key: number]: any }
): DataSource {
  const { gasPrice = "", gasLimit = "", transfer = null, execution = null } =
    envelop || {};

  const dataSource: Partial<DataSource> = {
    address: fromAddress,
    limit: gasLimit,
    price: `${gasPrice} (${fromRau(gasPrice, "Qev")} Qev)`
  };

  if (transfer) {
    const { recipient, amount, payload } = (transfer as unknown) as ITransfer;
    dataSource.toAddress = recipient;
    dataSource.amount = `${numberWithCommas(fromRau(amount, "IOTX"))} IOTX`;
    dataSource.dataInHex = `${Buffer.from(payload as Buffer).toString("hex")}`;
  }

  if (execution) {
    const { contract, amount, data } = (execution as unknown) as IExecution;
    dataSource.toContract = contract;
    dataSource.amount = `${numberWithCommas(fromRau(amount, "IOTX"))} IOTX`;
    dataSource.dataInHex = `${Buffer.from(data as Buffer).toString("hex")}`;
  }

  if (dataSource.dataInHex) {
    const { method = "" } = decode(JSON.stringify(abi), dataSource.dataInHex);
    dataSource.method = method;
  }

  return dataSource as DataSource;
}

export async function deserializeEnvelop(
  source: string,
  fromAddress: string
): Promise<Envelop> {
  const meta = await getAntenna().iotx.getAccount({ address: fromAddress });
  const nonce = String(
    (meta.accountMeta && meta.accountMeta.pendingNonce) || ""
  );
  const envelop = Envelop.deserialize(Buffer.from(source || "", "hex"));

  envelop.nonce = nonce;
  return envelop;
}

export interface WhitelistConfig {
  origin: string;
  method: string;
  recipient: string;
  amount: string;
  deadline: number;
}

export const createWhitelistConfig = (
  dataSource: DataSource,
  origin: string,
  deadline = NaN
): WhitelistConfig => {
  const { amount, toAddress, toContract, method } = dataSource;
  const recipient = (toAddress || toContract) as string;

  return { origin, method, amount, recipient, deadline };
};

export const moveGateState = (modalGate: number, next: string): number => {
  // modalGate: 1** -> length = 3; 0** -> length < 3;
  const forbiddenState = modalGate.toString(2).length < 3 ? "0" : "1";
  return parseInt(forbiddenState + next, 2);
};

export type ListValue = [string, string, string, number]; // [method, recipient, amount, deadline];

export type Whitelists = Map<string, Array<ListValue>>; // [origin: [[method, recipient, amount, deadline]]];

type OperateWhitelistFn = (
  res: Whitelists,
  origin: string,
  value: Array<ListValue>
) => void;

class WhitelistService {
  public save(config: WhitelistConfig): boolean {
    const { origin, ...extra } = config;
    let list = this.getList();

    if (list.has(origin)) {
      list = this.getUpdatedList(config, list);
    } else {
      list.set(origin, [this.getListValue(extra)]);
    }

    list = this.removeExpired(Date.now(), list);

    return xconf.setConf(XConfKeys.WHITELISTS, [...list]);
  }

  private getListValue(
    source: Pick<WhitelistConfig, Exclude<keyof WhitelistConfig, "origin">>
  ): ListValue {
    const { method, recipient, amount, deadline } = source;

    return [method, recipient, amount, deadline];
  }

  private isConfigEqual(compare: ListValue, target: ListValue): boolean {
    const last = compare.length - 1;

    return target.every((t, index) => index === last || t === compare[index]);
  }

  private isExpired(stamp: number, value: ListValue): boolean {
    const deadline = value[value.length - 1];

    return stamp > deadline;
  }

  private removeExpired(stamp: number, list: Whitelists): Whitelists {
    const result = new Map();

    for (const [origin, curValue] of list.entries()) {
      const updateValue = curValue.filter(ary => !this.isExpired(stamp, ary));

      if (!!updateValue.length) {
        result.set(origin, updateValue);
      }
    }
    return result;
  }

  public remove(target: WhitelistConfig): Whitelists {
    const targetValue = this.getListValue(target);
    const operate: OperateWhitelistFn = (result, origin, value) => {
      result.set(
        origin,
        value.filter(ary => !this.isTargetValue(ary, targetValue))
      );
    };

    return this.modify(target, operate);
  }

  public update(
    config: WhitelistConfig,
    oldConfig: WhitelistConfig
  ): Whitelists {
    const oValue = this.getListValue(oldConfig);
    const nValue = this.getListValue(config);
    const operate: OperateWhitelistFn = (result, origin, value) => {
      const idx = value.findIndex(ary => this.isTargetValue(ary, oValue));
      if (idx > -1) {
        value.splice(idx, 1, nValue);
      }
      result.set(origin, value);
    };

    return this.modify(oldConfig, operate);
  }

  private modify(
    target: WhitelistConfig,
    operateFn: OperateWhitelistFn
  ): Whitelists {
    const result = new Map<string, Array<ListValue>>();
    const list = this.getList();

    for (const [origin, curValue] of list.entries()) {
      if (origin === target.origin) {
        operateFn(result, origin, curValue);
      } else {
        result.set(origin, curValue);
      }
    }

    xconf.setConf(XConfKeys.WHITELISTS, [...result]);
    return result;
  }

  private isTargetValue(v1: ListValue, v2: ListValue): boolean {
    return v1.reduce(
      (acc, cur, idx) => acc && cur === v2[idx],
      true as boolean
    );
  }

  private getUpdatedList(
    config: WhitelistConfig,
    list: Whitelists
  ): Whitelists {
    const { origin } = config;
    const current = list.get(origin) as Array<ListValue>;
    const value = this.getListValue(config);
    const oldIndex = current.findIndex(target =>
      this.isConfigEqual(value, target)
    );

    if (oldIndex === -1) {
      list.set(origin, [...current, value]);
    } else {
      current[oldIndex] = value;
      list.set(origin, current);
    }

    return list;
  }

  public isInWhitelistsAndUnexpired(
    stamp: number,
    config: WhitelistConfig
  ): boolean {
    const { origin, ...extra } = config;
    const list = this.getList();
    const compare = this.getListValue(extra);

    if (list.has(origin)) {
      const value = list.get(origin) as Array<ListValue>;
      const target = value.find(ary => this.isConfigEqual(compare, ary));

      return !!target && !this.isExpired(stamp, target);
    }

    return false;
  }

  private getList(): Whitelists {
    const c = xconf.getConf<Array<[string, ListValue]>>(XConfKeys.WHITELISTS);

    return !!c ? new Map(c) : new Map();
  }

  public isWhitelistEnable(): boolean {
    const state = xconf.getConf<boolean>(XConfKeys.IS_WHITELIST_ENABLE);

    return state === null || state;
  }

  public setWhitelistState(state: boolean): void {
    xconf.setConf(XConfKeys.IS_WHITELIST_ENABLE, state);
  }

  public getConfigList(): Array<WhitelistConfig> {
    const list = this.removeExpired(Date.now(), this.getList());
    let result: Array<WhitelistConfig> = [];

    for (const [origin, ary] of list) {
      const data: Array<WhitelistConfig> = ary
        .filter(ary => ary.every(item => !!item))
        .map(([method, recipient, amount, deadline]) => ({
          origin,
          method,
          recipient,
          amount,
          deadline
        }));
      result = [...result, ...data];
    }

    return result;
  }

  public getConfigKey({ deadline }: WhitelistConfig): string {
    return deadline.toString(16);
  }
}

export const whitelistService = new WhitelistService();
