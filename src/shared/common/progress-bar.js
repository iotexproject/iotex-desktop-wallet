// @flow

import Component from 'inferno-component';
import isBrowser from 'is-browser';
import window from 'global';
import {colors} from '../common/styles/style-color';

const defaults = {
  color: colors.brand01,
  height: 2,
  hideDelay: '.3',
  percent: 0,
  speed: '.04',
  duration: '2',
};

type PropsType = {
  fetching: boolean,
};

export class ProgressBar extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      percent: 15,
      opacity: 1,
    };
  }

  props: {
    fetching: boolean,
  };

  componentDidMount() {
    this.intervalId = window.setInterval(() => this.updateBar(), 100 + 200 * Math.random());
    this.opacityId = window.setInterval(() => this.updateOpacity(), 100);
  }

  updateBar() {
    if (this.state.percent >= 90) {
      return;
    }
    this.setState({
      percent: Math.floor(this.state.percent + 1 + (5 * Math.random())),
    });
  }

  updateOpacity() {
    if (this.state.percent < 100) {
      if (this.state.opacity !== 1) {
        this.setState({
          opacity: 1,
        });
      }
    } else if (this.state.opacity > 0) {
      this.setState({
        opacity: this.state.opacity - 0.1,
      });
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalId);
    window.clearInterval(this.opacityId);
  }

  componentWillReceiveProps(nextProps: PropsType, nextContext: any) {
    if (!isBrowser) {
      return;
    }
    if (nextProps.fetching) {
      this.setState({
        percent: 15,
        opacity: 1,
      });
    } else {
      this.setState({
        percent: 100,
      });
    }
  }

  render() {
    const barStyle = {
      display: 'inline-block',
      position: 'fixed',
      top: 0,
      left: 0,
      width: `${this.state.percent}%`,
      zIndex: 1000,
      maxWidth: '100% !important',
      height: `${defaults.height}px`,
      boxShadow: '1px 1px 1px rgba(0,0,0,0.4)',
      borderRadius: '0 1px 1px 0',
      WebkitTransition: `${defaults.speed}s width, ${defaults.speed}s background-color`,
      transition: `${defaults.speed}s width, ${defaults.speed}s background-color`,
      backgroundColor: defaults.color,
      opacity: this.state.opacity,
    };

    return (
      <div>
        <div style={barStyle}></div>
      </div>
    );
  }
}
