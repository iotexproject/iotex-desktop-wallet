
import {Component} from 'react';
import {styled} from 'onefx/lib/styletron-react';
import window from 'global/window';

const ANIMATION_TIME = 0.3;

export class Modal extends Component {

  constructor(props) {
    super(props);

    const {getSetActiveFn} = this.props;

    this.state = {
      isActive: false,
      zoomOut: true,
    };

    this.timeoutId = null;

    this.setActive = this.setActive.bind(this);
    this.hide = this.hide.bind(this);

    getSetActiveFn(this.setActive);
  }

  setActive(flag, delay) {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }

    this.setState({
      isActive: flag,
      zoomOut: !flag,
    });

    // if flag is true, close after delay (if defined)
    if (flag && delay) {
      this.timeoutId = window.setTimeout(() => this.setState({
        isActive: !flag,
        zoomOut: flag,
      }), delay);
    }
  }

  hide() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }

    this.setState({
      isActive: false,
      zoomOut: true,
    });
  }

  render() {
    return (
      <Screen style={this.state.isActive ? {visibility: 'visible', opacity: '1'} : {visibility: 'hidden', opacity: '0'}}>
        <Wrapper style={{transform: this.state.zoomOut ? 'scale(0.7, 0.7)' : 'scale(1, 1)'}}>
          <Content>
            <CloseIcon onClick={this.hide} className='fas fa-times' />
            {this.props.children}
          </Content>
        </Wrapper>
      </Screen>
    );
  }
}

const Screen = styled('div', ({
  position: 'fixed',
  left: '0',
  right: '0',
  top: '0',
  bottom: '0',
  display: 'flex',
  alignItems: 'center',
  transition: `all ${ANIMATION_TIME}s ease-in-out`,
  zIndex: '88',
}));

const Wrapper = styled('div', ({
  width: '88%',
  maxWidth: '500px',
  margin: '1.75rem auto',
  position: 'relative',
  height: 'fit-content',
  transition: `transform ${ANIMATION_TIME}s ease`,
}));

const Content = styled('div', ({
  cursor: 'default',
  padding: '.75rem 1.25rem',
  color: '#0c5460',
  position: 'relative',
  backgroundColor: '#d1ecf1',
  border: '1px solid #bee5eb',
  borderRadius: '.3rem',
  outline: '0',
  fontSize: '1rem',
}));

const CloseIcon = styled('i', ({
  cursor: 'pointer',
  position: 'absolute',
  right: '.4rem',
  top: '.3rem',
}));
