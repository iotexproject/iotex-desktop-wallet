import {Route} from 'inferno-router';
import window from 'global/window';

import {AppContainer} from './app-container';
import {NotFound} from './common/not-found';
import {BlockchainExplorerContainer} from './blockchain-explorer/blockchain-explorer-container';
import {ExecutionContainer} from './execution/execution-container';
import {ExecutionsContainer} from './executions/executions-container';
import {TransferContainer} from './transfer/transfer-container';
import {TransfersContainer} from './transfers/transfers-container';
import {AddressContainer} from './address/address-container';
import {BlockContainer} from './block/block-container';
import {BlocksContainer} from './blocks/blocks-container';
import {SITE_URL, BLOCK, BLOCKS, ADDRESS, EXECUTION, EXECUTIONS, TRANSFER, TRANSFERS, VOTE, VOTES, WALLET} from './common/site-url';
import {VoteContainer} from './vote/vote-container';
import {VotesContainer} from './votes/votes-container';
import {WalletContainer} from './wallet/wallet-container';

export function createViewRoutes(routePrefix = '/') {
  return (
    <Route path={routePrefix} component={AppContainer}>
      <RoutePage path={SITE_URL} component={BlockchainExplorerContainer}/>
      <RoutePage path={EXECUTIONS.INDEX} component={ExecutionsContainer}/>
      <RoutePage path={EXECUTION.INDEX} component={ExecutionContainer}/>
      <RoutePage path={TRANSFERS.INDEX} component={TransfersContainer}/>
      <RoutePage path={TRANSFER.INDEX} component={TransferContainer}/>

      <RoutePage path={BLOCKS.INDEX} component={BlocksContainer}/>
      <RoutePage path={BLOCK.INDEX} component={BlockContainer}/>

      <RoutePage path={ADDRESS.INDEX} component={AddressContainer}/>

      <RoutePage path={VOTES.INDEX} component={VotesContainer}/>
      <RoutePage path={VOTE.INDEX} component={VoteContainer}/>

      <RoutePage path={WALLET.INDEX} component={WalletContainer}/>

      {/* <RoutePage path={DELEGATES.INDEX} component={DelegatesContainer}/>*/}

      <RoutePage path='*' component={NotFound}/>
    </Route>
  );
}

function RoutePage(props) {
  return (
    <Route onEnter={onEnter} {...props} />
  );
}

function onEnter() {
  // eslint-disable-next-line no-unused-expressions
  window && window.ga && window.ga('send', 'pageview');
  scrollTop();
}

function scrollTop() {
  if (window && window.scrollTo) {
    window.scrollTo(0, 0);
  }
}
