import {t} from "onefx/lib/iso-i18n";
import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {CSVLink} from "react-csv";
import {translateFn} from "../common/from-now";
import {IXRC721ActionInfo} from "./xrc721-action-list-page";

type ExportType = {actions: Array<IXRC721ActionInfo> | null}

interface ICSVData {
  hash: string
  timestamp: string
  sender: string
  to: string
  amount: string
}

const ExportXRC721Action: React.FC<ExportType> = forwardRef<{excExport(): void},ExportType>(({
  actions}, ref) =>
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

  useImperativeHandle(ref, () => ({
    excExport
  }));

  const excExport = async () => {

    const data = actions?.map(action => {
      return {
        hash: action.hash,
        timestamp: translateFn({ seconds: Number(action.timestamp), nanos: 0 }),
        sender: action.from,
        to: action.to,
        amount: action.quantity
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
    { label: `${t("action.amount")}`, key: "amount" }
  ];

  return <CSVLink
    data={csvData}
    headers={headers}
    filename={t("common.xrc721Transactions")}
    ref={csvInstance}/>
});

export default ExportXRC721Action
