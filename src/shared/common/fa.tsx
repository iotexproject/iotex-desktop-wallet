// @ts-ignore
import { styled } from "onefx/lib/styletron-react";

import { colorHover } from "./color-hover";
import { colors } from "./styles/style-color";

// @ts-ignore
export const Fa = styled("i", (props: React.CSSProperties) => ({
  fontSize: "24px!important",
  ...colorHover(colors.primary),
  ...props
}));
