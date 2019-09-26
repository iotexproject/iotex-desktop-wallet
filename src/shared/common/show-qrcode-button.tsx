// @ts-ignore
import Button from "antd/lib/button";
import Tooltip from "antd/lib/tooltip";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import QRcode from "qrcode.react";
import { Component } from "react";
import React from "react";

type Props = {
  text: string;
  size?: "small" | "default" | "large";
};

type State = {
  trigger: "hover" | "focus" | "click" | "contextMenu" | undefined;
  title: string;
  visible: boolean;
};

export class ShowQrcodeButton extends Component<Props, State> {
  public state: State = {
    trigger: "hover",
    title: t("copy.scan"),
    visible: false
  };

  private readonly handleVisibleChange = (visible: boolean) => {
    this.setState({ visible });
  };

  private readonly hideTips = () => {
    this.setState({ visible: false });
  };

  private readonly btnReload = () => {
    this.setState({
      trigger: "hover",
      title: t("copy.scan"),
      visible: true
    });
  };

  public render(): JSX.Element {
    const { trigger, visible } = this.state;
    const { size, text } = this.props;
    const InnerToolTip = (
      <div>
        <div style={{ marginBottom: "5px", textAlign: "center" }}>{text}</div>
        <div style={{ textAlign: "center" }}>
          <QRcode
            value={text}
            size={128}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"M"}
            renderAs="svg"
          />
        </div>
      </div>
    );
    return (
      <Tooltip
        placement="bottom"
        trigger={trigger}
        title={InnerToolTip}
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <Button
          shape="circle"
          icon="qrcode"
          size={size}
          onMouseLeave={() => this.hideTips()}
          onMouseOver={() => this.btnReload()}
        />
      </Tooltip>
    );
  }
}
