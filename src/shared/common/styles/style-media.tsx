export const PALM_WIDTH = 575;
export const LAP_WIDTH = 768;
export const WIDE_WIDTH = 1600;

export const media = {
  palm: `@media only screen and (max-width: ${PALM_WIDTH - 1}px)`,
  toLap: `@media only screen and (max-width: ${LAP_WIDTH - 1}px)`,
  lap: `@media only screen and (min-width: ${PALM_WIDTH}px) and (max-width: ${LAP_WIDTH -
    1}px)`,
  media960: "@media only screen and (max-width: 960px)",
  desk: `@media only screen and (min-width: ${LAP_WIDTH}px) and (max-width: 1279px)`,
  deskWide: "@media only screen and (min-width: 1280px)",
  media1024: "@media only screen and (max-width: 1023px)",
  toWide: `@media only screen and (max-width: ${WIDE_WIDTH - 1}px)`
};

export const fullOnPalm = {
  [media.palm]: {
    width: "100%"
  }
};
