import {shade} from './styles/shade';

export function colorHover(color: string) {
  return {
    color,
    ':hover': {
      color: shade(color),
    },
  };
}
