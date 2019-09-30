import { AccountBalanceRenderer } from "./account-balance-renderer";
import { AgeRenderer } from "./age-renderer";
import { BlockHeightRenderer } from "./block-height-renderer";
import { IOTXValueRenderer } from "./iotx-value-renderer";
import { ReceiptAddressRenderer } from "./reciept-address-renderer";
import { StatusRenderer } from "./status-renderer";
import { TextCopyRenderer } from "./text-copy-renderer";
import { TextAreaRenderer } from "./textarea-renderer";
import { TokenTransferRenderer } from "./token-transfer-renderer";
import { WalletAddressRenderer } from "./wallet-address-renderer";

const CommonRenderer = {
  status: StatusRenderer,
  timestamp: AgeRenderer,
  blkHeight: BlockHeightRenderer,
  from: WalletAddressRenderer,
  to: ReceiptAddressRenderer,
  value: IOTXValueRenderer,
  logs: TextAreaRenderer,
  data: TextAreaRenderer,
  evmTransfer: TokenTransferRenderer
};

const AddressDetailRenderer = {
  timestamp: AgeRenderer,
  balance: AccountBalanceRenderer,
  nametag: WalletAddressRenderer
};

const BlockDetailRenderer = {
  height: BlockHeightRenderer,
  timestamp: AgeRenderer,
  producerAddress: WalletAddressRenderer,
  transferAmount: IOTXValueRenderer,
  txRoot: TextCopyRenderer,
  receiptRoot: TextCopyRenderer,
  deltaStateDigest: TextCopyRenderer
};

export { AddressDetailRenderer, CommonRenderer, BlockDetailRenderer };
