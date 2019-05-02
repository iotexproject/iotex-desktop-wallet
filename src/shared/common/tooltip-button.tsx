import Button from "antd/lib/button";
import Tooltip from "antd/lib/tooltip";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";

type Props = {
  title: string;
  size?: "small" | "default" | "large";
  trigger?: "hover" | "focus" | "click" | "contextMenu" | undefined;
  icon: string;
  onClick?: Function;
  href?: string;
};

type State = {};

export class TooltipButton extends Component<Props, State> {
  public render(): JSX.Element {
    const { href, title, size, trigger, icon, onClick } = this.props;
    return (
      <Tooltip placement="top" trigger={trigger} title={title}>
        <Button
          href={href || "#"}
          target="_blank"
          shape="circle"
          icon={icon}
          size={size}
          // @ts-ignore
          onClick={(e: MouseEvent) => onClick && onClick(e)}
        />
      </Tooltip>
    );
  }
}
