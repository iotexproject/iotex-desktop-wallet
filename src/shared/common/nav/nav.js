// @flow

import Component from 'inferno-component';
import {styled} from 'styletron-inferno';
import serialize from 'form-serialize';
import window from 'global/window';
import isBrowser from 'is-browser';
import {assetURL} from '../../../lib/asset-url';
import {t} from '../../../lib/iso-i18n';
import {BLOCKS, SITE_URL, EXECUTIONS, TRANSFERS, VOTES, WALLET, IOTEX_URL, NAV} from '../site-url';
import {titleFont} from '../../../shared/common/styles/style-font';
import {fetchPost} from '../../../lib/fetch-post';

function Icon() {
  return (
    <span style={{paddingRight: '8px'}}><i className='fas fa-link'/></span>
  );
}

export class Nav extends Component {
  _form: any;
  props: {
    chains: Array<{
      name: string,
      url: string,
    }>
  };

  constructor(props: any) {
    super(props);
    this.state = {
      displayDropdownMenu: false,
      fetchCoinStatistic: 0,
      fetchCoinPrice: 0,
      error: false,
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

  handleSubmit(e: { preventDefault: any }) {
    e.preventDefault();

    const formData = serialize(this._form, {hash: true});
    this.setState({fetching: true});
    if (formData.search !== '') {
      fetchPost(NAV.FUZZY_SEARCH, {hashStr: `${formData.search}`}).then(res => {
        if (res.ok === true) {
          if (res.result.block) {
            window.location = `/blocks/${formData.search}`;
            return;
          }

          if (res.result.transfer) {
            window.location = `/transfers/${formData.search}`;
            return;
          }

          if (res.result.vote) {
            window.location = `/votes/${formData.search}`;
            return;
          }

          if (res.result.execution) {
            window.location = `/executions/${formData.search}`;
            return;
          }

        } else {
          this.setState({error: true});
        }
      });
    }
  }

  render() {
    const {chains, href} = this.props;
    let name = '';
    let path = '';
    for (const c of chains) {
      if (href.indexOf(c.url) !== -1) {
        name = c.name;
        path = href.replace(c.url, '');
      }
    }

    return (
      <div className='navbar is-fixed-top' role='navigation'>
        <NavWrapper>
          <nav className='navbar is-black'>
            <div className='container'>
              <div className='navbar-brand'>
                <a className='navbar-item' href={IOTEX_URL}>
                  <img
                    src={assetURL('/logo.svg')}
                    alt='IoTeX Explorer'
                    width='112'
                    height='28'
                  />
                </a>
                <a className='navbar-item' href={SITE_URL}>{t('nav.explorer')}</a>
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
              <div id='navMenuColordark-example'
                className={`navbar-menu ${this.state.displayDropdownMenu ? 'is-active' : ''}`}
              >
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
                          <input name='search'
                            className={`input ${this.state.error === true ? 'is-danger' : ''}`}
                            type='text'
                            style='min-width: 350px'
                            placeholder={t('nav.fuzzy.search.placeholder')}
                            onChange={() => {
                              this.setState({error: false});
                            }}
                          />
                        </NavWrapper>
                        <div className='control'>
                          <button type='submit' className='button'>
                            <i className='fas fa-search'/>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className='navbar-item has-dropdown is-hoverable'>
                    <p className='navbar-link'>
                      <Icon/>{name}
                    </p>
                    <div className='navbar-dropdown' style={{paddingTop: '0px', borderTop: '0px'}}>
                      {chains.map((c, i) => (
                        <a target='_blank' rel='noopener noreferrer' key={i} className='navbar-item' href={c.url + path}>
                          <Icon/>{c.name}
                        </a>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </nav>
          <div className='info-bar nav-price'>
            <div className='content has-text-centered'>
              <div className='columns is-mobile' style={{marginTop: '0rem'}}>
                <div
                  className='column is-one-third nav-price-col'>IOTX/BTC: {this.props.price ? this.props.price.btc : 'N/A'}</div>
                <div
                  className='column nav-price-col'>IOTX/ETH: {this.props.price ? this.props.price.eth : 'N/A'}</div>
                <div
                  className='column nav-price-col'>IOTX/USD: {this.props.price ? this.props.price.usd : 'N/A'}</div>
              </div>
            </div>
          </div>
        </NavWrapper>
      </div>
    );
  }
}

const NavWrapper = styled('div', props => ({
  width: '100%',
  fontFamily: titleFont,
}));
