import {t} from "onefx/lib/iso-i18n";
import React, { Ref, useEffect, useImperativeHandle, useRef, useState} from "react";
import {CSVLink} from "react-csv";
import {translateFn} from "../common/from-now";
import {IXRC20ActionInfo} from "./xrc20-action-list-page";

type ExportType = {actions: Array<IXRC20ActionInfo> | null, refInstance?: Ref<{excExport(): void}>}

interface ICSVData {
  hash: string
  timestamp: string
  sender: string
  to: string
  amount: string
  token: string
}

const ExportXRC20Action: React.FC<ExportType> = ({
  actions, refInstance}) =>
{

  const csvInstance = useRef<CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }>(null);
  const [csvData, setCsvData] = useState<Array<ICSVData>>([]);

  useEffect(() => {
    if (csvData.length > 0) {
      setTimeout(() => {
        csvInstance.current?.link.click()
      }, 1000)
    }
  }, [csvData]);

  useImperativeHandle(refInstance, () => ({
    excExport
  }));

  const excExport = async () => {

    const data = actions?.map(action => {
      return {
        hash: action.hash,
        timestamp: translateFn({ seconds: Number(action.timestamp), nanos: 0 }),
        sender: action.from,
        to: action.to,
        amount: action.quantity,
        token: action.contract,
      }
    });

    if (data) {
      setCsvData(data);
    }
  };

  const headers = [
    { label: `${t("action.hash")}`, key: "hash" },
    { label: `${t("block.timestamp")}`, key: "timestamp" },
    { label: `${t("action.sender")}`, key: "sender" },
    { label: `${t("render.key.to")}`, key: "to" },
    { label: `${t("action.amount")}`, key: "amount" },
    { label: `${t("token.token")}`, key: "token" },
  ];

  return <CSVLink
    data={csvData}
    headers={headers}
    filename={t("common.xrc20Transactions")}
    ref={csvInstance}/>
};

export default ExportXRC20Action
