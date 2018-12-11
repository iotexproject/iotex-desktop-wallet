// @flow
import {Component} from 'react';
import window from 'global/window';
import document from 'global/document';
import {styled} from 'onefx/lib/styletron-react';

import {btnStyle, disabledBtn, secondaryBtnColor} from './styles/style-button';

type Props = {
  id: string;
  href: string;
  children: any;
  onClick: any;
  secondary: boolean;
  disabled: boolean;
  target: any;
  width: string;
  preventDoubleClickFor: string;
};

export class Button extends Component<Props> {
  wrapper: any;
  props: Props;

  preventDoubleClick() {
    const btn = this.wrapper.children[0];
    const form = document.getElementById(this.props.preventDoubleClickFor);
    if (form instanceof window.HTMLFormElement && form.checkValidity()) {
      // eslint-disable-next-line no-unused-expressions
      typeof form.submit === 'function' && form.submit();
      btn.setAttribute('disabled', 'disabled');
      btn.style.opacity = '0.5';
      const preloader = document.createElement('i');
      preloader.setAttribute('class', 'fab fa-gear fa-spin');
      btn.appendChild(document.createTextNode(' '));
      btn.appendChild(preloader);
    }
  }

  render() {
    const {href, children, onClick, secondary, disabled, target, width, preventDoubleClickFor = '', id} = this.props;
    let style = btnStyle;
    if (secondary) {
      style = {
        ...style,
        ...secondaryBtnColor,
      };
    }
    if (disabled) {
      style = {
        ...style,
        ...disabledBtn,
      };
    }
    if (width) {
      style = {
        ...style,
        width,
      };
    }
    const Button = styled(href ? 'a' : 'button', style);

    return (
      <div ref={r => this.wrapper = r}>
        <Button id={id} href={href} onClick={e => {
          if (preventDoubleClickFor) {
            this.preventDoubleClick();
          }
          if (onClick) {
            return onClick(e);
          }
          return true;
        }} target={target}
        >
          {children}
        </Button>
      </div>
    );
  }
}
