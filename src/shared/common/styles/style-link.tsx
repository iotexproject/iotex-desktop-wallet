import {transition} from './style-animation';
import {colors} from './style-color';

export const styleLink = {
  color: colors.text01,
  marginLeft: '8px',
  marginTop: '8px',
  marginBottom: '8px',
  textDecoration: 'none',
  ':hover': {
    color: colors.brand01,
  },
  transition,
};
