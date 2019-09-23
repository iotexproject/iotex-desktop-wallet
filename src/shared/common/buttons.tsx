import Button, { ButtonProps } from "antd/lib/button";
import { BaseButtonProps } from "antd/lib/button/button";
import React from "react";
import { Link } from "react-router-dom";

export type LinkButtonProps = {
  href?: string;
  disabled?: boolean;
  icon?: string;
} & BaseButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const LinkButton: React.FC<LinkButtonProps> = props => {
  const { type, disabled, href, className, children, style, ...attrs } = props;
  if (!disabled && href) {
    if (href.match(/^https?\:\/\/|^mailto\:/i)) {
      return (
        <a
          className={`${className} link-button`}
          href={href}
          target="_blank"
          rel="noreferrer"
          style={style}
        >
          {children}
        </a>
      );
    } else {
      return (
        <Link className={`${className} link-button`} to={href} style={style}>
          {children}
        </Link>
      );
    }
  }
  return (
    <Button style={style} {...attrs} className={`${className} link-button`}>
      {children}
    </Button>
  );
};

const PrimaryButton: React.FC<ButtonProps> = props => {
  const { type, children, style, ...attrs } = props;
  return (
    // @ts-ignore
    <Button {...attrs} type="primary">
      {children}
    </Button>
  );
};

export { LinkButton, PrimaryButton };
