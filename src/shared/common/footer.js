import {styled} from 'onefx/lib/styletron-react';
import {contentPadding} from './styles/style-padding';
import {colors} from './styles/style-color';
import {Flex} from './flex';
import {TOP_BAR_HEIGHT} from './top-bar';

export const FOOTER_HEIGHT = 89;

export const FOOTER_ABOVE = {
  minHeight: `calc(100vh - ${(FOOTER_HEIGHT + TOP_BAR_HEIGHT)}px)`,
};

export function Footer() {
  return (
    <Align>
      <Flex>{`Copyright © ${new Date().getFullYear()}`}</Flex>
      <Flex>Built with ❤️ in San Francisco</Flex>
    </Align>
  );
}

const Align = styled('div', props => ({
  ...contentPadding,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: '32px',
  paddingBottom: '32px',
  height: `${FOOTER_HEIGHT}px`,
  backgroundColor: colors.nav02,
  color: colors.inverse01,
}));
