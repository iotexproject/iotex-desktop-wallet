export const PALM_WIDTH = 575;

export const media = {
  palm: `@media only screen and (max-width: ${PALM_WIDTH}px)`,
  lap: `@media only screen and (min-width: ${PALM_WIDTH}px) and (max-width: 768px)`,
  desk: '@media only screen and (min-width: 769px) and (max-width: 1280px)',
  deskWide: '@media only screen and (min-width: 1281px)',
};

export const fullOnPalm = {
  [media.palm]: {
    width: '100%',
  },
};

export const noneOnPalm = {
  [media.palm]: {
    display: 'none',
  },
};
