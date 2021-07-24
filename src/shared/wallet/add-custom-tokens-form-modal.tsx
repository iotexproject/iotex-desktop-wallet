import Form from "antd/lib/form";
import { WrappedFormUtils } from "antd/lib/form/Form";
import Modal from "antd/lib/modal";

// @ts-ignore
// tslint:disable-next-line:import-blacklist
import {AutoComplete, Input} from "antd";
import axios from "axios";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import {connect, DispatchProp} from "react-redux";
import {AppTokenMetadata} from "../common/common-metadata";
import { rulesMap } from "../common/rules";
import { colors } from "../common/styles/style-color";
import {IRPCProvider, IWalletState} from "./wallet-reducer";

const TEST_URL = "https://iopay-wallet.iotex.io/api/tokenMetadata/testnet";
const MAIN_URL = "https://iopay-wallet.iotex.io/api/tokenMetadata/mainnet";

export interface IAddCustomTokensFormModalProps extends DispatchProp {
  onOK(tokenAddress: string): void;
  onCancel(): void;
  visible?: boolean;
  form: WrappedFormUtils;
  network?: IRPCProvider
}
class AddCustomTokensFormModal extends React.PureComponent<
  IAddCustomTokensFormModalProps
> {
  public state: { confirming: boolean, metadataList: Array<AppTokenMetadata>, options: Array<AppTokenMetadata> } = {
    confirming: false,
    metadataList: [],
    options: []
  };
  public handleOk = async () => {
    const { form, onOK } = this.props;
    if (!onOK) {
      return;
    }
    this.setState({ confirming: true });
    form.validateFields(["tokenAddress"], async (err, { tokenAddress }) => {
      if (err) {
        return;
      }
      await onOK(tokenAddress);
      this.setState({ confirming: false });
    });
  };


  public filterOptions = (data: string) => {
    const filteredList = this.state.metadataList.filter((item) => {
      return item.symbol.toUpperCase().includes(data.toUpperCase()) || item.name.toUpperCase().includes(data.toUpperCase())
    });
    this.setState({
      options: filteredList
    })
  };

  public componentWillReceiveProps(nextProps: IAddCustomTokensFormModalProps): void {
    if (this.props.network?.url !== nextProps.network?.url) {
      return
    }
    this.getTokenList(nextProps.network?.name)
  }

  private getTokenList = (network?: String) => {
    let tokenUrl = TEST_URL;
    if (network === "mainnet") {
      tokenUrl = MAIN_URL
    }
    axios({
      url: tokenUrl,
      method: "GET"
    })
      .then(res => {
        // tslint:disable-next-line:no-any
        const data = res.data as Array<AppTokenMetadata>;
        const list: Array<AppTokenMetadata> = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].type === "xrc20") {
            list.push(data[i]);
          }
        }
        this.setState({
          metadataList: list,
        })
      })
      .catch()
  };

  private renderOption(): Array<JSX.Element> {
    return this.state.options.map(item => {
      return (
        <AutoComplete.Option key={item.address}>
          <div
            style={{
              cursor: "pointer",
              color: colors.primary,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ width: 180, marginRight: 20 }}>
              <img
                src={item.logo}
                alt="ico"
                style={{ width: "13px", height: "13px" }}
              />
              <span style={{ marginLeft: "2px", whiteSpace: "nowrap" }}>
                {`${item.name}(${item.symbol || ""})`}
              </span>
            </div>
            <div className="ellipsis-text" style={{ flex: 1 }}>
              {item.address}
            </div>
          </div>
        </AutoComplete.Option>
      );
    })
  }

  public render(): JSX.Element {
    const { form, onCancel, visible = false } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        title={t("account.token.addToken")}
        visible={visible}
        onOk={this.handleOk}
        onCancel={onCancel}
        confirmLoading={this.state.confirming}
        bodyStyle={{
          paddingTop: "0px !important"
        }}
      >
        <Form.Item
          label={t("wallet.input.search")}
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "flex-start",
            flexDirection: "column"
          }}
          wrapperCol={{
            xs: 24
          }}
        >
          {getFieldDecorator("tokenAddress", {
            rules: rulesMap.tokenAddress
          })(
            <AutoComplete
              placeholder="io..."
              style={{ width: "100%" }}
              dataSource={this.renderOption()}
              optionLabelProp="value"
              onSearch={this.filterOptions}
              onFocus={() => {
                this.filterOptions("")
              }}
            >
              <Input
                style={{ width: "100%", backgroundColor: colors.black10 }}
              />
            </AutoComplete>
          )}
        </Form.Item>
      </Modal>
    );
  }
}

const mapStateToProps = (state: {
  wallet: IWalletState;
}): {
  network?: IRPCProvider;
} => ({
  network: (state.wallet || {}).network
});

const AddCustomRPCFormModalCom = Form.create<IAddCustomTokensFormModalProps>()(
  AddCustomTokensFormModal
);

export default connect(mapStateToProps)(AddCustomRPCFormModalCom)

