// @flow

import {styled} from 'onefx/lib/styletron-react';

const LEN = '100%';

type PropTypes = {
  url: string,

  width?: string,
  height?: string,
  margin?: string,
};

export function Icon({width = LEN, height = LEN, url, margin = '0'}: PropTypes) {
  const StyledDiv = styled('div', {
    background: `url("${url}") no-repeat center`,
    backgroundSize: 'contain !important',
    boxSizing: 'border-box',
    width,
    height,
    margin,
  });

  return (
    <StyledDiv/>
  );
}

