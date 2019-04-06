// @ts-ignore
import Button from "antd/lib/button";
import Tooltip from "antd/lib/tooltip";
import { Component } from "react";
import * as copy from "text-to-clipboard";

import React from "react";

type Props = {
  text: string;
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
    title: "Copy address to clipboard",
    copied: "",
    visible: false
  };

  private readonly copyToAddress = () => {
    const { text } = this.props;
    copy.copyCB(text || "");
    this.setState({
      trigger: "click",
      title: "Copied",
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
      title: "Copy address to clipboard",
      copied: "",
      visible: true
    });
  };

  public render(): JSX.Element {
    const { trigger, title, copied, visible } = this.state;
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
          shape="circle"
          icon="copy"
          onClick={() => this.copyToAddress()}
          onMouseLeave={() => this.hideTips()}
          onMouseOver={() => this.btnReload()}
        />
      </Tooltip>
    );
  }
}
