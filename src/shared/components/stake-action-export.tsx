import {t} from "onefx/lib/iso-i18n";
import React, {Ref, useEffect, useImperativeHandle, useRef, useState} from "react";
import {CSVLink} from "react-csv";
import {translateFn} from "../common/from-now";
import {IStakeActionInfo} from "./stake-action-table";

type ExportType = {actions: Array<IStakeActionInfo> | null, refInstance?: Ref<{excExport(): void}>}

interface ICSVData {
  hash: string
  blkHash: string
  timestamp: string
  sender: string
  amount: string
  gasFee: string
}

const ExportEvmAction: React.FC<ExportType> = ({
  actions, refInstance}) =>
{

  const csvInstance = useRef<CSVLink & HTMLAnchorElement & { link?: HTMLAnchorElement }>(null);
  const [csvData, setCsvData] = useState<Array<ICSVData>>([]);

  useEffect(() => {
    if (csvData.length > 0) {
      setTimeout(() => {
        csvInstance.current?.link?.click()
      }, 1000)
    }
  }, [csvData]);

  useImperativeHandle(refInstance, () => ({
    excExport
  }));

  const excExport = async () => {

    const data = actions?.map(action => {
      return {
        hash: action.actHash,
        blkHash: action.blkHash,
        timestamp: translateFn({ seconds: Number(action.timeStamp), nanos: 0 }),
        sender: action.from,
        amount: action.quantity,
        gasFee: action.quantity
      }
    });

    if (data) {
      setCsvData(data);
    }
  };

  const headers = [
    { label: `${t("action.hash")}`, key: "hash" },
    { label: `${t("action.block_hash")}`, key: "blkHash" },
    { label: `${t("block.timestamp")}`, key: "timestamp" },
    { label: `${t("action.from")}`, key: "sender" },
    { label: `${t("render.key.to")}`, key: "to" },
    { label: `${t("action.amount")}`, key: "amount" }
  ];

  return <CSVLink
    data={csvData}
    headers={headers}
    filename={t("common.contract_transactions")}
    ref={csvInstance}/>
};

export default ExportEvmAction
