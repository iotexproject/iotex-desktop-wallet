// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import { colors } from "../../../common/styles/style-color";
import { fonts } from "../../../common/styles/style-font";

export const inputStyle = (
  props: React.CSSProperties & { error: boolean }
) => ({
  color: `${props.color || colors.text01} !important`,
  borderRadius: "0px !important",
  backgroundColor: `${colors.white} !important`,
  position: "relative !important",
  display: "block !important",
  width: "100% !important",
  border: `1px solid ${props.error ? colors.error : colors.black20}`,
  ":focus": {
    border: `1px solid ${props.error ? colors.error : colors.primary}`
  },
  ...fonts.textBox,
  lineHeight: "24px !important",
  padding: "11px !important",
  outline: "none",
  transition: "all 200ms ease",
  boxSizing: "border-box",
  backgroundClip: "padding-box"
});

// @ts-ignore
export const TextInput = styled("input", inputStyle);
