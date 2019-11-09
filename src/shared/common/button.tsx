// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import { Component } from "react";

import React from "react";
import {
  btnStyle,
  disabledBtn,
  secondaryBtnColor
} from "./styles/style-button";

type Props = {
  id?: string;
  href?: string;
  children?: Array<JSX.Element> | JSX.Element | string;
  onClick?: Function;
  secondary?: boolean;
  disabled?: boolean;
  target?: string;
  width?: string;
};

export class Button extends Component<Props> {
  public wrapper: HTMLDivElement | null = null;

  public render(): JSX.Element {
    const {
      href,
      children,
      onClick,
      secondary,
      disabled,
      target,
      width,
      id
    } = this.props;
    let style = {
      ...btnStyle,
      cursor: "pointer",
      borderColor: "unset",
      opacity: "unset"
    };
    if (secondary) {
      style = {
        ...style,
        ...secondaryBtnColor
      };
    }
    if (disabled) {
      style = {
        ...style,
        ...disabledBtn
      };
    }
    if (width) {
      style = {
        ...style,
        width
      };
    }

    // @ts-ignore
    const Button = styled(href ? "a" : "button", style);

    return (
      <div ref={r => (this.wrapper = r)}>
        <Button
          id={id}
          href={href}
          onClick={(e: Event) => {
            if (onClick) {
              return onClick(e);
            }
            return true;
          }}
          target={target}
        >
          {children}
        </Button>
      </div>
    );
  }
}
