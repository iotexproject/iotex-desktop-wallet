import Alert from "antd/lib/alert";
import Modal from "antd/lib/modal";
import Tabs from "antd/lib/tabs";
import isElectron from "is-electron";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { CommonMargin } from "../common/common-margin";
import { colors } from "../common/styles/style-color";
import { UnlockByKeystoreFile } from "./unlock-by-keystore-file";
import { UnlockByMnemonic } from "./unlock-by-mnemonic";
import { UnlockByPrivateKey } from "./unlock-by-private-key";

export interface Props {
  chainId: number;
  setCreateNew: Function;
}

export interface State {
  showModal: boolean;
}

class UnlockWallet extends React.Component<Props, State> {
  public state: State = {
    showModal: false
  };

  public createNewWallet = (status: boolean) => {
    this.setState({ showModal: false });
    if (status) {
      this.props.setCreateNew();
    }
  };

  public render(): JSX.Element {
    const { chainId } = this.props;
    const { showModal } = this.state;

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
          <React.Fragment>
            <Alert
              message={t("unlock-wallet.warn.message")}
              type="warning"
              closable={true}
              showIcon={true}
            />
            <CommonMargin />
          </React.Fragment>
        )}

        <Tabs onChange={() => undefined} type="card">
          <Tabs.TabPane tab={t("unlock-wallet.by_keystore")} key="1">
            <UnlockByKeystoreFile />
          </Tabs.TabPane>
          <Tabs.TabPane tab={t("unlock-wallet.by_private_key")} key="2">
            <UnlockByPrivateKey />
          </Tabs.TabPane>
          <Tabs.TabPane tab={t("unlock-wallet.by_mnemonic")} key="3">
            <UnlockByMnemonic />
          </Tabs.TabPane>
        </Tabs>

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
  color: colors.primary
});

export default UnlockWallet;
