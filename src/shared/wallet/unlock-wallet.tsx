// import { ContentPadding } from "../common/styles/style-padding";
import Alert from "antd/lib/alert";
import Button from "antd/lib/button";
import Form from "antd/lib/form";
import { WrappedFormUtils } from "antd/lib/form/Form";
import Icon from "antd/lib/icon";
import Input from "antd/lib/input";
import Modal from "antd/lib/modal";
import { get } from "dottie";
import isElectron from "is-electron";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { getAntenna } from "./get-antenna";
import { FormItemLabel } from "./wallet";

export interface Props {
  form: WrappedFormUtils;
  chainId: number;
  setCreateNew: Function;
  setWallet: Function;
}

export interface State {
  showModal: boolean;
  priKey: string;
}

class UnlockWalletComponent extends React.Component<Props, State> {
  public state: State = {
    showModal: false,
    priKey: ""
  };

  public handleInputChange = (e: React.FormEvent) => {
    const name: string = get(e, "target.name");
    const value = get(e, "target.value");
    // @ts-ignore
    this.setState({
      [name]: value
    });
  };

  public createNewWallet = (status: boolean) => {
    this.setState({ showModal: false });
    if (status) {
      this.props.setCreateNew();
    }
  };

  public unlockWallet = async () => {
    this.props.form.validateFields(async err => {
      if (!err) {
        const { priKey } = this.state;
        const antenna = getAntenna();
        const account = await antenna.iotx.accounts.privateKeyToAccount(priKey);
        this.props.setWallet(account);
      }
    });
  };

  public render(): JSX.Element {
    const { getFieldDecorator } = this.props.form;
    const { chainId } = this.props;
    const { showModal, priKey } = this.state;
    const validPrikey = priKey.length === 64;

    return (
      <div>
        <Modal
          title={t("wallet.unlock.new.title")}
          visible={showModal}
          onOk={() => this.createNewWallet(true)}
          onCancel={() => this.createNewWallet(false)}
          okText={t("wallet.unlock.new.yes")}
        >
          <p>{t("wallet.unlock.new.p1")}</p>
          <p>{t("wallet.unlock.new.p2")}</p>
        </Modal>
        <WalletTitle>{t("unlock-wallet.title")}</WalletTitle>
        {!isElectron() && (
          <Alert
            message={t("unlock-wallet.warn.message")}
            type="warning"
            closable
            showIcon
          />
        )}
        <div style={{ margin: "24px" }} />
        <Form layout="vertical">
          <Form.Item
            label={
              <FormItemLabel>
                {t("wallet.account.enterPrivateKey")}
              </FormItemLabel>
            }
          >
            {getFieldDecorator("priKey", {
              rules: [
                {
                  required: true,
                  message: t("input.error.private_key.invalid")
                },
                {
                  len: 64,
                  message: t("input.error.private_key.length")
                }
              ]
            })(
              <Input
                className="form-input"
                placeholder={t("wallet.account.placehold.privateKey")}
                type="password"
                name="priKey"
                onChange={e => this.handleInputChange(e)}
                suffix={
                  <Icon
                    type="eye-invisible"
                    style={{ color: "rgba(0,0,0,.45)" }}
                  />
                }
              />
            )}
          </Form.Item>
        </Form>
        <Button disabled={!validPrikey} onClick={this.unlockWallet}>
          {t("wallet.account.unlock")}
        </Button>
        <div style={{ paddingTop: "24px" }}>
          <p>
            {t("unlock-wallet.no-wallet")}
            {chainId === 1 ? (
              <StyleLink
                style={{ paddingLeft: "10px", cursor: "pointer" }}
                onClick={() => {
                  this.setState({
                    showModal: true
                  });
                }}
              >
                {t("unlock-wallet.create")}
              </StyleLink>
            ) : (
              <span style={{ paddingLeft: "10px" }}>
                {t("unlock-wallet.main-chain")}
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }
}

const WalletTitle = styled("p", {
  fontSize: "24px",
  fontWeight: "bold"
});

const StyleLink = styled("span", {
  color: "#00b4a0"
});

export default Form.create<UnlockWalletComponent>()(UnlockWalletComponent);
