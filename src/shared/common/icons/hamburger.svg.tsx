import React from 'react';

function Hamburger(): JSX.Element {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="https://www.w3.org/2000/svg">
      <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeMiterlimit="10"
            d="M4 7h22M4 15h22M4 23h22"/>
    </svg>
  );
}

export {Hamburger};
