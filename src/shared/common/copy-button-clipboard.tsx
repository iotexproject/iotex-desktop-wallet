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
};

export class CopyButtonClipboardComponent extends Component<Props, State> {
  public state: State = {
    trigger: "hover",
    title: "Copy address to clipboard",
    copied: ""
  };

  private readonly copyToAddress = () => {
    const { text } = this.props;
    copy.copyCB(text || "");
    this.setState({
      trigger: "click",
      title: "Copied",
      copied: "copied"
    });
  };

  public render(): JSX.Element {
    const { trigger, title, copied } = this.state;
    return (
      <Tooltip placement="top" title={title} trigger={trigger}>
        <Button
          className={copied}
          shape="circle"
          icon="copy"
          onClick={() => this.copyToAddress()}
        />
      </Tooltip>
    );
  }
}
