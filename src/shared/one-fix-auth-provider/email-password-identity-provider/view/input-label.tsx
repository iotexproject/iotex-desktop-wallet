// @ts-ignore
import { styled, StyleObject } from "onefx/lib/styletron-react";
import { fonts } from "../../../common/styles/style-font";

// @ts-ignore
const style: StyleObject = {
  ...fonts.inputLabel,
  display: "inline-block",
  verticalAlign: "baseline",
  marginBottom: "0.625rem"
};

export const InputLabel = styled("label", style);
