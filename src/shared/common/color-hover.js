import {shade} from './styles/shade';

export function colorHover(color) {
  return {
    color,
    ':hover': {
      color: shade(color),
    },
  };
}
