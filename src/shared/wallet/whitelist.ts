import { fromRau } from "iotex-antenna/lib/account/utils";
import { Envelop } from "iotex-antenna/lib/action/envelop";
import { IExecution, ITransfer } from "iotex-antenna/lib/rpc-method/types";

import { xconf, XConfKeys } from "../common/xconf";
import { getAntenna } from "./get-antenna";

export interface DataSource {
  address: string;
  limit: string;
  price: string;
  amount: string;
  dataInHex: string;
  toAddress?: string;
  toContract?: string;
}

export function getDataSource(
  envelop: Envelop,
  fromAddress: string
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
    dataSource.amount = `${fromRau(amount, "IOTX")} IOTX`;
    dataSource.dataInHex = `${Buffer.from(payload as Buffer).toString("hex")}`;
  }

  if (execution) {
    const { contract, amount, data } = (execution as unknown) as IExecution;
    dataSource.toContract = contract;
    dataSource.amount = `${fromRau(amount, "IOTX")} IOTX`;
    dataSource.dataInHex = `${Buffer.from(data as Buffer).toString("hex")}`;
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
  method: string,
  deadline = NaN
): WhitelistConfig => {
  const { amount, toAddress, toContract } = dataSource;
  const recipient = (toAddress || toContract) as string;

  return { origin, method, amount, recipient, deadline };
};

export const moveGateState = (modalGate: number, next: string): number => {
  // modalGate: 1** -> length = 3; 0** -> length < 3;
  const forbiddenState = modalGate.toString(2).length < 3 ? "0" : "1";
  return parseInt(forbiddenState + next, 2);
};

export type ListValue = [string, string, string, number];

export type Whitelists = Map<string, Array<ListValue>>;

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
}

export const whitelistService = new WhitelistService();
