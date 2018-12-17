// @flow

import Component from 'inferno-component';
import {connect} from 'inferno-redux';
import document from 'global/document';
import window from 'global/window';

class IotexExplorerTitle extends Component {
  props: {
    status: string,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      fetchLive: 0,
    };
  }

  componentWillUnmount() {
    window.clearInterval(this.state.fetchLive);
  }

  componentDidMount() {
    const fetchLive = window.setInterval(() => this.flash(), 500);
    this.setState({fetchLive});
  }

  flash() {
    const tag = document.getElementsByClassName('live-tag-icon')[0];
    tag.style.visibility = tag.style.visibility === 'hidden' ? 'visible' : 'hidden';
  }

  render() {
    return (
      <div className='column container main-title-wrap'>
        <h1 className='title main-title'>IoTeX.Explorer</h1>
        <span className='live-tag'>
          <i className='fas fa-circle live-tag-icon'/>
          <span className='live-tag-text'>{this.props.status}</span>
        </span>
        <br/>
        <small className='version-text'>{`version ${this.props.version}`}</small>
      </div>
    );
  }
}

export const TitleContainer = connect(
  function mapStateToProps(state) {
    return {
      version: state.base.version,
    };
  }
)(IotexExplorerTitle);
