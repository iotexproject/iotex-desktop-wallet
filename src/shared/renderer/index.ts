import { AccountBalanceRenderer } from "./account-balance-renderer";
import { AgeRenderer } from "./age-renderer";
import { BlockEpochNumRenderer } from "./block-epoch-num-renderer";
import { BlockHeightRenderer } from "./block-height-renderer";
import { EvmTransferRenderer } from "./evm-transfer-render";
import { IOTXValueRenderer } from "./iotx-value-renderer";
import { ReceiptAddressRenderer } from "./reciept-address-renderer";
import { StatusRenderer } from "./status-renderer";
import { TextCopyRenderer } from "./text-copy-renderer";
import { TextAreaRenderer } from "./textarea-renderer";
import { TransferPayloadRenderer } from "./transfer-payload-renderer";
import { WalletAddressRenderer } from "./wallet-address-renderer";
import { Xrc20TransferRenderer } from "./xrc20-transfer-renderer";

const CommonRenderer = {
  status: StatusRenderer,
  timestamp: AgeRenderer,
  blkHeight: BlockHeightRenderer,
  from: WalletAddressRenderer,
  to: ReceiptAddressRenderer,
  payload: TransferPayloadRenderer,
  value: IOTXValueRenderer,
  logs: TextAreaRenderer,
  data: TextAreaRenderer,
  evmTransfer: Xrc20TransferRenderer,
  evmTransfers: EvmTransferRenderer
};

const AddressDetailRenderer = {
  timestamp: AgeRenderer,
  balance: AccountBalanceRenderer,
  nametag: WalletAddressRenderer
};

const BlockDetailRenderer = {
  height: BlockHeightRenderer,
  epochNum: BlockEpochNumRenderer,
  timestamp: AgeRenderer,
  producerAddress: WalletAddressRenderer,
  transferAmount: IOTXValueRenderer,
  txRoot: TextCopyRenderer,
  receiptRoot: TextCopyRenderer,
  deltaStateDigest: TextCopyRenderer
};

export { AddressDetailRenderer, CommonRenderer, BlockDetailRenderer };
