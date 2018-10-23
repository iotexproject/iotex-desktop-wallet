import {colors} from './style-color';
import {shade} from './shade';

const primaryBtnColor = {
  color: `${colors.ui01} !important`,
  background: `${colors.brand01} !important`,
  ':hover': {
    background: `${shade(colors.brand01)} !important`,
  },
};

export const secondaryBtnColor = {
  color: `${colors.brand01} !important`,
  background: `${colors.inverse01} !important`,
  ':hover': {
    background: `${shade(colors.inverse01)} !important`,
  },
  borderColor: `${colors.brand01} !important`,
};

export const disabledBtn = {
  cursor: 'not-allowed',
  opacity: '0.5',
};

export const btnStyle = {
  cursor: 'pointer !important',
  '-webkit-transition': 'background 0.3s, border-color 0.3s !important',
  '-moz-transition': 'background 0.3s, border-color 0.3s !important',
  transition: 'background 0.3s, border-color 0.3s !important',
  position: 'relative !important',
  display: 'inline-block !important',
  textAlign: 'center !important',
  textDecoration: 'none !important',
  textTransform: 'uppercase !important',
  border: '2px solid transparent !important',
  borderRadius: '0px !important',
  fontSize: '16px !important',
  lineHeight: '22px !important',
  letterSpacing: 'undefined !important',
  fontWeight: '700 !important',
  padding: '6px 6px 6px 6px !important',
  boxSizing: 'border-box',
  ...primaryBtnColor,
};
