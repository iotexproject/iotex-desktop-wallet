// @ts-ignore
import Button from "antd/lib/button";
import Tooltip from "antd/lib/tooltip";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { Component } from "react";
import * as copy from "text-to-clipboard";
// @ts-ignore
import QRcode from "qrcode.react";

import React from "react";

type Props = {
  text: string;
  size?: "small" | "default" | "large";
};

type State = {
  trigger: "hover" | "focus" | "click" | "contextMenu" | undefined;
  title: string;
  copied: string;
  visible: boolean;
};

export class CopyButtonClipboardComponent extends Component<Props, State> {
  public state: State = {
    trigger: "hover",
    title: t("copy.toClipboard"),
    copied: "",
    visible: false
  };

  private readonly copyToAddress = () => {
    const { text } = this.props;
    copy.copyCB(text || "");
    this.setState({
      trigger: "click",
      title: t("copy.copied"),
      copied: "copied",
      visible: true
    });
  };

  private readonly handleVisibleChange = (visible: boolean) => {
    this.setState({ visible });
  };

  private readonly hideTips = () => {
    this.setState({ copied: "", visible: false });
  };

  private readonly btnReload = () => {
    this.setState({
      trigger: "hover",
      title: t("copy.toClipboard"),
      copied: "",
      visible: true
    });
  };

  public render(): JSX.Element {
    const { trigger, title, copied, visible } = this.state;
    const { size, text } = this.props;
    const InnerToolTip = (
      <div>
        <div style={{ marginBottom: "5px", textAlign: "center" }}>
          {t("copy.scan")}
        </div>
        <div style={{ textAlign: "center" }}>
          <QRcode
            value={text}
            size={128}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"M"}
            includeMargin={false}
            renderAs={"svg"}
          />
        </div>
      </div>
    );
    return (
      <Tooltip
        placement="bottomRight"
        trigger={trigger}
        title={title}
        visible={visible}
      >
        <Tooltip
          placement="bottomLeft"
          trigger={trigger}
          title={InnerToolTip}
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
          align={{ offset: [35, 4] }}
        >
          <Button
            className={copied}
            shape="circle"
            icon="copy"
            size={size}
            onClick={() => this.copyToAddress()}
            onMouseLeave={() => this.hideTips()}
            onMouseOver={() => this.btnReload()}
          />
        </Tooltip>
      </Tooltip>
    );
  }
}
