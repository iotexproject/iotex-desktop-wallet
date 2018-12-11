import {styled} from 'onefx/lib/styletron-react';

import {colorHover} from './color-hover';
import {colors} from './styles/style-color';

export const Fa = styled('i', props => ({
  fontSize: '24px!important',
  ...colorHover(colors.brand01),
  ...props,
}));
