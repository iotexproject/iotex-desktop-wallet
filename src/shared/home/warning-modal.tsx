import Button from "antd/lib/button";
import Modal from "antd/lib/modal";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { colors } from "../common/styles/style-color";

type State = {
  visible: boolean;
};

export class WarningModal extends Component<{}, State> {
  public state: State = { visible: false };

  public showModal = () => {
    this.setState({
      visible: true
    });
  };

  public handleOk = () => {
    this.setState({
      visible: false
    });
  };

  public handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  // tslint:disable:react-no-dangerous-html
  public render(): JSX.Element {
    return (
      <div>
        <Button href="#" type="primary" onClick={this.showModal}>
          Open Modal
        </Button>
        <Modal
          title={t("home.modal.warning.title")}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={t("home.modal.warning.ok")}
          okButtonProps={{
            style: {
              backgroundColor: colors.primary,
              borderColor: colors.primary
            }
          }}
        >
          <p
            dangerouslySetInnerHTML={{
              __html: t("home.modal.warning.content")
            }}
          />
        </Modal>
      </div>
    );
  }
}
