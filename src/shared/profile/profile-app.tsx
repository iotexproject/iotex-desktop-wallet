import {
  Icon, Layout, Menu,
} from 'antd';
import {History} from 'history';
// @ts-ignore
import {assetURL} from 'onefx/lib/asset-url';
// @ts-ignore
import {t} from 'onefx/lib/iso-i18n';
// @ts-ignore
import Helmet from 'onefx/lib/react-helmet';
// @ts-ignore
import {styled} from 'onefx/lib/styletron-react';
import React from 'react';
import {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Route, Switch, withRouter} from 'react-router';
import {CommonMargin} from '../common/common-margin';
import {Head} from '../common/head';
import {colors} from '../common/styles/style-color';
import {fonts} from '../common/styles/style-font';
import {ContentPadding} from '../common/styles/style-padding';
import {TOP_BAR_HEIGHT, TopBar} from '../common/top-bar';
import {Settings} from './settings';

// $FlowFixMe
const {Footer} = Layout;

type Props = {
  locale: string,
  history: History,
}

type State = {
  toggled: boolean,
}

function Empty() {
  return (
    <div/>
  );
}

export const RootStyle = styled('div', (_: React.CSSProperties) => ({
  ...fonts.body,
  backgroundColor: colors.ui02,
  color: colors.text01,
  textRendering: 'optimizeLegibility',
}));

class ProfileApp extends PureComponent<Props, State> {
  public state: State = {toggled: false};

  public render() {
    const {locale, history} = this.props;
    const {Sider, Content} = Layout;

    const PANES = [
      {
        path: '/profile/',
        tab: (
          <span><Icon type="dashboard"/>{t('profile.home')}</span>
        ),
        component: Empty,
      },
      {
        path: '/profile/settings/',
        tab: (
          <span><Icon type="setting"/>{t('profile.settings')}</span>
        ),
        component: Settings,
      },
    ];

    return (
      <RootStyle>
        <Head locale={locale}/>
        <Helmet>
          <link rel="stylesheet" type="text/css" href={assetURL('/stylesheets/antd.css')}/>
        </Helmet>

        <TopBar/>
        <Layout tagName={'main'}>
          <CommonMargin/>
          <ContentPadding>

            <Layout
              tagName={'section'}
              style={{padding: '24px 0', background: '#fff', minHeight: `calc((100vh - ${TOP_BAR_HEIGHT}px) - 86px)`}}
              hasSider={true}
            >
              <Sider width={200} style={{background: '#fff'}}>
                <Menu
                  mode="inline"
                  defaultSelectedKeys={[String(PANES.findIndex(p => p.path === history.location.pathname))]}
                  style={{height: '100%'}}
                >
                  {PANES.map((p, i) => (
                    <Menu.Item key={i} onClick={() => history.push(PANES[i].path)}>
                      {p.tab}
                    </Menu.Item>
                  ))}
                </Menu>
              </Sider>
              <Content tagName={'section'} style={{background: '#fff', margin: '0 16px'}}>
                <Switch>
                  {PANES.map((p, i) => (
                    <Route key={i} path={p.path} exact component={p.component}/>
                  ))}
                </Switch>
              </Content>

            </Layout>

            <Footer tagName={'footer'} style={{textAlign: 'center'}}>
              Copyright © 2019 IoTeX · Built with ❤️ in Menlo Park
            </Footer>
          </ContentPadding>
        </Layout>

      </RootStyle>
    );
  }
}

export const ProfileAppContainer = withRouter(
  // @ts-ignore
  connect(
    function mapStateToProps(state) {
      return {
        // @ts-ignore
        googleTid: state.base.analytics.googleTid,
        // @ts-ignore
        locale: state.base.locale,
      };
    },
  )(ProfileApp));
