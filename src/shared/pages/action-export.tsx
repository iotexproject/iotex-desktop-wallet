import {get} from "dottie";
import {fromRau} from "iotex-antenna/lib/account/utils";
import {publicKeyToAddress} from "iotex-antenna/lib/crypto/crypto";
import {IActionCore, IReceipt} from "iotex-antenna/lib/rpc-method/types";
import {t} from "onefx/lib/iso-i18n";
import React, {forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState} from "react";
import {withApollo, WithApolloClient} from "react-apollo";
import {CSVLink} from "react-csv";
import {ActionInfo, GetActionsByHashRequest} from "../../api-gateway/resolvers/antenna-types";
import {translateFn} from "../common/from-now";
import {getActionType} from "../common/get-action-type";
import {numberWithCommas} from "../common/vertical-table";
import {GET_ACTION_DETAILS_BY_HASH} from "../queries";
import {IActionsDetails} from "./action-detail-page";
import {getAddress} from "./action-list-page";

type ExportType = WithApolloClient<{}> & {actions: Array<ActionInfo> | null, refInstance: Ref<any>}

interface ICSVData {
  hash: string
  timestamp: string
  sender: string
  type: string
  to: string
  amount: string
  fee: string
}

const Export: React.FC<ExportType> = ({
  client,
  actions,
  refInstance}) =>
{

  const csvInstance = useRef<any>(null);
  const [csvData, setCsvData] = useState<Array<ICSVData>>([]);
  const [tagData, setTagData] = useState<Array<ActionInfo> | null>(null);

  useEffect(() => {
    setTagData(actions)
  }, [actions]);

  useEffect(() => {
    if (csvData.length > 0) {
      setTimeout(() => {
        csvInstance.current.link.click()
      }, 1000)
    }
  }, [csvData]);

  useImperativeHandle(refInstance, () => ({
    excExport
  }));

  const queryActionDetail = async (hash: string) => {
    const res = await client.query<IActionsDetails>({
      query: GET_ACTION_DETAILS_BY_HASH,
      variables: {
        actionHash: hash,
        checkingPending: true
      } as GetActionsByHashRequest
    });
    return res.data
  };

  const resolveFee = (data: IActionsDetails) => {
    const { gasPrice = "0" } =
    get<IActionCore>(data, "action.actionInfo.0.action.core") || {};
    const { gasConsumed = 0 } =
    get<IReceipt>(data, "receipt.receiptInfo.receipt") || {};
    return `${numberWithCommas(
      fromRau(`${gasConsumed * Number(gasPrice)}`, "Iotx")
    )}`
  };

  const resolveAddress = (data: IActionsDetails) => {
    const { contractAddress } =
    get<IReceipt>(data, "receipt.receiptInfo.receipt") || {};

    return contractAddress
  };

  const translateAmount = (action: ActionInfo) => {
    const amount: string =
      get(action, "action.core.execution.amount") ||
      get(action, "action.core.grantReward.amount") ||
      get(action, "action.core.transfer.amount") ||
      get(action, "action.core.createDeposit.amount") ||
      get(action, "action.core.settleDeposit.amount") ||
      get(action, "action.core.createPlumChain.amount") ||
      get(action, "action.core.plumCreateDeposit.amount") ||
      get(action, "action.core.grantReward.amount") ||
      get(action, "action.core.stakeAddDeposit.amount") ||
      "";
    if (!amount) {
      return "-";
    }

    return `${numberWithCommas(fromRau(amount, "IOTX"))} IOTX`;
  };

  const excExport = async () => {

    const data = actions?.map(action => {
      return {
        hash: action.actHash,
        timestamp: translateFn(action.timestamp),
        sender: publicKeyToAddress(String(action.action.senderPubKey)),
        type: getActionType(action),
        to: getAddress(action),
        amount: translateAmount(action),
        fee: "",
      }
    });

    if (data) {
      if (tagData?.length) {
        const temp = tagData;
        const promiseArray: Array<Promise<void>> = [];
        tagData.forEach(action => {
          const p = queryActionDetail(action.actHash).then(actionDetail => {
            const index = data.findIndex(item => {
              return item.hash === actionDetail.action?.actionInfo[0].actHash
            });

            if (index !== -1) {
              const csvData = data[index];
              csvData.fee = resolveFee(actionDetail);
              csvData.to = resolveAddress(actionDetail)
            }

            const rmIndex = temp.findIndex(item => {
              return item.actHash === actionDetail.action?.actionInfo[0].actHash
            });
            if (rmIndex !== -1) {
              temp.splice(rmIndex, 1);
            }
          });
          promiseArray.push(p)
        });

        Promise.all(promiseArray).finally(() => {
          setTagData(temp);
          setCsvData(data);
        })
      } else {
        csvInstance.current.link.click();
      }
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
};

const ApolloComponent = withApollo(Export);

export const ExportAction: React.FC<{actions:  Array<ActionInfo> | null}> =
  forwardRef<{excExport(): void},{actions:  Array<ActionInfo> | null}>(({
  actions
}, ref) => {
  return <ApolloComponent actions={actions} refInstance={ref}/>
});

