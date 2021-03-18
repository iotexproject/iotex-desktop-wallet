import Form from "antd/lib/form";
import { WrappedFormUtils } from "antd/lib/form/Form";
import Modal from "antd/lib/modal";

// @ts-ignore
// tslint:disable-next-line:import-blacklist
import { Select } from "antd";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { GetTokenMetadataMap, TokenMetadata } from "../common/common-metadata";
import { rulesMap } from "../common/rules";
import { colors } from "../common/styles/style-color";

export interface IAddCustomTokensFormModalProps {
  onOK(tokenAddress: string): void;
  onCancel(): void;
  visible?: boolean;
  form: WrappedFormUtils;
}
class AddCustomTokensFormModal extends React.PureComponent<
  IAddCustomTokensFormModalProps
> {
  public state: { confirming: boolean } = {
    confirming: false
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
  public render(): JSX.Element {
    const { form, onCancel, visible = false } = this.props;
    const { getFieldDecorator } = form;
    const metadataList: Array<TokenMetadata> = [];
    const tokenMetadataMap = GetTokenMetadataMap();
    if (tokenMetadataMap) {
      for (const [k, v] of Object.entries(tokenMetadataMap)) {
        if (v.type === "xrc20") {
          v.address = k;
          metadataList.push(v);
        }
      }
    }
    return (
      <Modal
        title={t("account.token.addCustom")}
        visible={visible}
        onOk={this.handleOk}
        onCancel={onCancel}
        confirmLoading={this.state.confirming}
        bodyStyle={{
          paddingTop: "0px !important"
        }}
      >
        <Form.Item
          label={t("wallet.input.fromXrc20")}
          wrapperCol={{
            xs: 24
          }}
        >
          {getFieldDecorator("tokenAddress", {
            rules: rulesMap.tokenAddress
          })(
            <Select
              placeholder="io..."
              style={{ width: "100%", backgroundColor: colors.black10 }}
              defaultActiveFirstOption={false}
              showArrow={true}
              optionLabelProp="label"
            >
              {metadataList.map(item => {
                return (
                  <Select.Option
                    key={item.address}
                    value={item.address}
                    label={item.address}
                  >
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
                          src={`/image/token/${item.logo}`}
                          alt="ico"
                          style={{ width: "13px", height: "13px" }}
                        />
                        <span
                          style={{ marginLeft: "2px", whiteSpace: "nowrap" }}
                        >
                          {`${item.name}(${item.symbol || ""})`}
                        </span>
                      </div>
                      <div className="ellipsis-text" style={{ flex: 1 }}>
                        {item.address}
                      </div>
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          )}
        </Form.Item>
      </Modal>
    );
  }
}

const AddCustomRPCFormModalCom = Form.create<IAddCustomTokensFormModalProps>()(
  AddCustomTokensFormModal
);
export default AddCustomRPCFormModalCom;
