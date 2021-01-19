import moment from "moment";
import {t} from "onefx/lib/iso-i18n";
import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {CSVLink} from "react-csv";
import {IAnalyticActionInfo} from "./action-list-page";

type ExportType = {actions: Array<IAnalyticActionInfo> | null}

interface ICSVData {
  hash: string
  timestamp: string
  sender: string
  type: string
  to: string
  amount: string
  fee: string
}

export const ExportAnalyticAction: React.FC<ExportType> = forwardRef<{excExport(): void},ExportType>(({
  actions}, ref) =>
{

  const csvInstance = useRef<any>(null);
  const [csvData, setCsvData] = useState<Array<ICSVData>>([]);

  useEffect(() => {
    if (csvData.length > 0) {
      setTimeout(() => {
        csvInstance.current.link.click()
      }, 1000)
    }
  }, [csvData]);

  useImperativeHandle(ref, () => ({
    excExport
  }));

  const excExport = async () => {

    const data = actions?.map(action => {
      return {
        hash: action.actHash,
        timestamp:  moment.unix(parseInt(action.timeStamp, 10)).fromNow(),
        sender: action.sender,
        type: action.actType,
        to: action.recipient,
        amount: action.amount,
        fee: action.gasFee,
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
    { label: `${t("action.type")}`, key: "type" },
    { label: `${t("render.key.to")}`, key: "to" },
    { label: `${t("action.amount")}`, key: "amount" },
    { label: `${t("render.key.fee")}`, key: "fee" },
  ];

  return <CSVLink
    data={csvData}
    headers={headers}
    filename={t("topbar.actions")}
    ref={csvInstance}/>
});
