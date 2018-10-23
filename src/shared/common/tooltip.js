// @flow

import Component from 'inferno-component';
import {styled} from 'styletron-inferno';
import window from 'global/window';
import {colors} from './styles/style-color';
import {colorHover} from './color-hover';

type PropsType = {
  iconClass: string,
  message: string,
  customPadClass: ?string,
};

export class ToolTip extends Component {
  props: PropsType;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      position: 'right',
    };
  }

  componentDidMount() {
    this.reposition();
    window.addEventListener('resize', this.reposition.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.reposition.bind(this));
  }

  reposition() {
    const offsetLeft = this._ref.parentElement.offsetLeft;
    const offsetRight = window.innerWidth - offsetLeft;
    const position = (offsetRight < offsetLeft && (offsetRight < this._ref.clientWidth + 20)) ? 'left' : 'right';
    this.setState({position});
  }

  render() {
    return (
      <div className='tooltip'>
        <Icon className={this.props.iconClass}/>
        <span className={`tooltiptext-${this.state.position} ${this.props.customPadClass || ''}`} ref={r => this._ref = r}>{this.props.message}</span>
      </div>
    );
  }
}

const Icon = styled('i', props => ({
  cursor: 'pointer',
  ...colorHover(colors.brand02, colors.brand02),
}));
