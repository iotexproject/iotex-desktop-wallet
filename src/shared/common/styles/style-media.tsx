export const PALM_WIDTH = 575;
export const LAP_WIDTH = 768;

export const media = {
  palm: `@media only screen and (max-width: ${PALM_WIDTH}px)`,
  toLap: `@media only screen and (max-width: ${LAP_WIDTH}px)`,
  lap: `@media only screen and (min-width: ${PALM_WIDTH}px) and (max-width: 768px)`,
  media960: "@media only screen and (max-width: 960px)",
  desk: "@media only screen and (min-width: 769px) and (max-width: 1280px)",
  deskWide: "@media only screen and (min-width: 1281px)",
  media1024: "@media only screen and (max-width: 1024px)"
};

export const fullOnPalm = {
  [media.palm]: {
    width: "100%"
  }
};
