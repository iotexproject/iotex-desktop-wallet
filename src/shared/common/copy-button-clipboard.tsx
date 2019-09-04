// @ts-ignore
import Button from "antd/lib/button";
import Tooltip from "antd/lib/tooltip";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { Component } from "react";
import * as copy from "text-to-clipboard";

import React from "react";

type Props = {
  text: string;
  size?: "small" | "default" | "large";
  icon: "copy" | "link";
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
    const { size, icon } = this.props;
    return (
      <Tooltip
        placement="top"
        trigger={trigger}
        title={title}
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <Button
          className={copied}
          icon={icon}
          shape="circle"
          size={size}
          onClick={() => this.copyToAddress()}
          onMouseLeave={() => this.hideTips()}
          onMouseOver={() => this.btnReload()}
        />
      </Tooltip>
    );
  }
}
