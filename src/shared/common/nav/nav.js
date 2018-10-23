// @flow

import Component from 'inferno-component';
import {styled} from 'styletron-inferno';
import serialize from 'form-serialize';
import window from 'global/window';
import isBrowser from 'is-browser';
import {assetURL} from '../../../lib/asset-url';
import {t} from '../../../lib/iso-i18n';
import {BLOCKS, SITE_URL, EXECUTIONS, TRANSFERS, VOTES, WALLET} from '../site-url';

export class Nav extends Component {
  _form: any;

  constructor(props: any) {
    super(props);
    this.state = {
      displayDropdownMenu: false,
      fetchCoinStatistic: 0,
      fetchCoinPrice: 0,
    };

    (this: any).toggleDropdownMenu = this.toggleDropdownMenu.bind(this);
  }

  toggleDropdownMenu() {
    this.setState({
      displayDropdownMenu: !this.state.displayDropdownMenu,
    });
  }

  componentWillMount() {
    if (isBrowser) {
      this.props.fetchCoinStatistic();
      this.props.fetchCoinPrice();
    }
  }

  componentDidMount() {
    if (isBrowser) {
      const fetchCoinStatistic = window.setInterval(() => this.props.fetchCoinStatistic(), 30000);
      const fetchCoinPrice = window.setInterval(() => this.props.fetchCoinPrice(), 30000);
      this.setState({fetchCoinStatistic, fetchCoinPrice});
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.state.fetchCoinStatistic);
    window.clearInterval(this.state.fetchCoinPrice);
  }

  handleSubmit(e: {preventDefault: any}) {
    e.preventDefault();
    const formData = serialize(this._form, {hash: true});
    switch (formData.option) {
    case 'Address': {
      window.location = `/address/${formData.search}`;
      break;
    }
    case 'Execution': {
      window.location = `/executions/${formData.search}`;
      break;
    }
    case 'Transfer': {
      window.location = `/transfers/${formData.search}`;
      break;
    }
    case 'Block': {
      window.location = `/blocks/${formData.search}`;
      break;
    }
    case 'Vote': {
      window.location = `/votes/${formData.search}`;
      break;
    }
    default: {
      window.location = SITE_URL;
      break;
    }
    }
  }

  render() {
    return (
      <div>
        <div className='navbar is-fixed-top' role='navigation'>
          <NavWrapper>
            <nav className='navbar is-black'>
              <div className='container'>
                <div className='navbar-brand'>
                  <a className='navbar-item' href={SITE_URL}>
                    <img
                      src={assetURL('/logo.svg')}
                      alt='IoTeX Explorer'
                      width='112'
                      height='28'
                    />
                  </a>
                  <div
                    className={`navbar-burger burger ${this.state.displayDropdownMenu ? 'is-active' : ''}`}
                    data-target='navMenuColordark-example'
                    onClick={() => this.toggleDropdownMenu()}
                  >
                    <span aria-hidden='true'/>
                    <span aria-hidden='true'/>
                    <span aria-hidden='true'/>
                  </div>
                </div>
                <div id='navMenuColordark-example' className={`navbar-menu ${this.state.displayDropdownMenu ? 'is-active' : ''}`}>
                  <div className='navbar-end'>
                    <div className='navbar-item has-dropdown is-hoverable'>
                      <p className='navbar-link'>Tools</p>
                      <div className='navbar-dropdown' style={{paddingTop: '0px', borderTop: '0px'}}>
                        <a className='navbar-item' href={EXECUTIONS.INDEX}>{t('meta.executions')}</a>
                        <a className='navbar-item' href={TRANSFERS.INDEX}>{t('meta.transfers')}</a>
                        <a className='navbar-item' href={BLOCKS.INDEX}>{t('meta.blocks')}</a>
                        <a className='navbar-item' href={VOTES.INDEX}>{t('meta.votes')}</a>
                      </div>
                    </div>
                    <div className='navbar-item'>
                      <a className='navbar-item' href={WALLET.INDEX}>{t('meta.account')}</a>
                    </div>
                    <div className='navbar-item'>
                      <form onSubmit={e => this.handleSubmit(e)} ref={r => (this._form = r)}>
                        <div className='field has-addons'>
                          <NavWrapper className='control'>
                            <input name='search' className='input' type='text' placeholder='Search'/>
                          </NavWrapper>
                          <NavWrapper className='control'>
                            <div className='select is-fullwidth'>
                              <select name='option'>
                                <option value='Address'>{t('meta.address')}</option>
                                <option value='Execution'>{t('meta.execution')}</option>
                                <option value='Transfer'>{t('meta.transfer')}</option>
                                <option value='Block'>{t('meta.block')}</option>
                                <option value='Vote'>{t('meta.vote')}</option>
                              </select>
                            </div>
                          </NavWrapper>
                          <div className='control'>
                            <button className='button'>
                              <i className='fas fa-search'/>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
            <div className='info-bar nav-price'>
              <div className='content has-text-centered'>
                <div className='columns is-mobile' style={{marginTop: '0rem'}}>
                  <div className='column is-half nav-price-col'>IOTX/ETH: {this.props.price ? this.props.price.eth : 0}</div>
                  <div className='column is-half nav-price-col'>IOTX/USD: {this.props.price ? this.props.price.usd : 0}</div>
                </div>
              </div>
            </div>
          </NavWrapper>
        </div>
      </div>
    );
  }
}

const NavWrapper = styled('div', props => ({
  width: '100%',
}));
