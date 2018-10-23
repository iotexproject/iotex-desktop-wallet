// @flow

import {shade} from './styles/shade';

export function colorHover(normal: string, hover: string): any {
  return {
    color: normal,
    ':hover': {
      color: shade(hover),
    },
  };
}
