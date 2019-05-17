import { shade } from "./shade";
import { colors } from "./style-color";

const primaryBtnColor = {
  color: `${colors.white} !important`,
  background: `${colors.primary} !important`,
  ":hover": {
    background: `${shade(colors.primary)} !important`
  }
};

export const secondaryBtnColor = {
  color: `${colors.primary} !important`,
  background: `${colors.white} !important`,
  ":hover": {
    background: `${shade(colors.primary)} !important`,
    color: `${colors.white} !important`
  },
  borderColor: `${colors.primary} !important`
};

export const disabledBtn = {
  cursor: "not-allowed",
  opacity: "0.5"
};

export const btnStyle = {
  width: "auto",
  cursor: "pointer !important",
  "-webkit-transition": "background 0.3s, border-color 0.3s !important",
  "-moz-transition": "background 0.3s, border-color 0.3s !important",
  transition: "background 0.3s, border-color 0.3s !important",
  position: "relative !important",
  display: "inline-block !important",
  textAlign: "center !important",
  textDecoration: "none !important",
  textTransform: "uppercase !important",
  border: "2px solid transparent !important",
  borderRadius: "4px !important",
  fontSize: "16px !important",
  lineHeight: "22px !important",
  letterSpacing: "undefined !important",
  fontWeight: "500 !important", // semi-bold
  padding: "6px 6px 6px 6px !important",
  boxSizing: "border-box",
  ...primaryBtnColor
};
