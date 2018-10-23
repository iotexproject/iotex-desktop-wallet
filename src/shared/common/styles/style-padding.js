import {styled} from 'styletron-inferno';

import {media} from './style-media';

export const wideContentPadding = {
  paddingLeft: '16px',
  paddingRight: '16px',
};

export const contentPadding = {
  [media.palm]: wideContentPadding,
  paddingLeft: '6.6vw',
  paddingRight: '6.6vw',
  [media.deskWide]: {
    paddingLeft: '16vw',
    paddingRight: '16vw',
  },
};

export const topBottomContentPadding = {
  paddingTop: '12px',
  paddingBottom: '12px',
};

export const ContentPadding = styled('div', contentPadding);
