import { Button, Modal } from "antd";
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

  public render(): JSX.Element {
    return (
      <div>
        <Button href="#" type="primary" onClick={this.showModal}>
          Open Modal
        </Button>
        <Modal
          title="Please pay attention..."
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="I understand. Continue."
          okButtonProps={{
            style: {
              backgroundColor: colors.primary,
              borderColor: colors.primary
            }
          }}
        >
          <p>
            We do not store your private key on the server. The private key
            generation is handled on your browser only.
          </p>
          <p />
          <p>
            <strong>Back up your private key</strong> because you will use it to
            access your wallet. If you lose your private key, it cannot be
            recovered.
          </p>
        </Modal>
      </div>
    );
  }
}
