/* eslint-disable */
// @flow

import Component from 'inferno-component';
import loadScript from 'load-script';
import window from 'global/window';
import {colors} from './styles/style-color';
import {assetURL} from '../../lib/asset-url';

const HEIGHT = 300;
const WIDTH = 300;
const COLOR = {
  delegate: ['#B45FFF', '#fca800', '#e84f77'],
  grey: colors.ui02,
  candidate: 'white',
};

const RADIUS = {
  delegate: 5.5,
  candidate: 4,
};

let d3Loaded;
/*istanbul ignore next*/
function lazyLoadD3(cb) {
  if (d3Loaded) {
    return window.d3 && cb(window.d3);
  }
  d3Loaded = true;
  loadScript('https://d3js.org/d3.v4.min.js', () => {
    window.d3 && cb(window.d3);
  });
}

const nodes_data = [
  {id: 0, x: '156', y: '152', type: 'CANDIDATE'},
  {id: 1, x: '223', y: '156', type: 'CANDIDATE'},
  {id: 2, x: '92', y: '151', type: 'CANDIDATE'},
  {id: 3, x: '218', y: '120', type: 'CANDIDATE'},
  {id: 4, x: '206', y: '235', type: 'CANDIDATE'},
  {id: 5, x: '244', y: '249', type: 'CANDIDATE'},
  {id: 6, x: '186', y: '268', type: 'CANDIDATE'},
  {id: 7, x: '228', y: '244', type: 'CANDIDATE'},
  {id: 8, x: '139', y: '64', type: 'CANDIDATE'},
  {id: 9, x: '148', y: '197', type: 'CANDIDATE'},
  {id: 10, x: '204', y: '196', type: 'CANDIDATE'},
  {id: 11, x: '113', y: '111', type: 'CANDIDATE'},
  {id: 12, x: '178', y: '218', type: 'CANDIDATE'},
  {id: 13, x: '84', y: '218', type: 'CANDIDATE'},
  {id: 14, x: '67', y: '74', type: 'CANDIDATE'},
  {id: 15, x: '224', y: '212', type: 'CANDIDATE'},
  {id: 16, x: '26', y: '154', type: 'CANDIDATE'},
  {id: 17, x: '116', y: '239', type: 'CANDIDATE'},
  {id: 18, x: '82', y: '44', type: 'CANDIDATE'},
  {id: 19, x: '152', y: '257', type: 'CANDIDATE'},
  {id: 20, x: '238', y: '197', type: 'CANDIDATE'},
];

/*istanbul ignore next*/
export class PlasmaBall extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      voteRound: 0,
      lastRoundDelegates: '',
      label: '',
      node: {},
      flash: 0,
      startTime: new Date(),
    };
  }

  props: {
    delegates: any,
    currentProducer: string,
    offline: any,
    candidates: any,
  };

  updateType() {
    for (let i = 0; i < nodes_data.length; i++) {
      let type = 'CANDIDATE';
      if (this.props.currentProducer === this.props.candidates[i]) {
        type = 'CURRENT_PRODUCER';
      }
      else if (this.props.offline.includes(this.props.candidates[i])) {
        type = 'OFFLINE';
      }
      else if (this.props.delegates.includes(this.props.candidates[i])) {
        type = 'DELEGATES';
      }
      nodes_data[i].type = type;
    }
  }

  updateVoteRound() {
    const delegateString = JSON.stringify(this.props.delegates);
    if (delegateString !== this.state.lastRoundDelegates) {
      const voteRound = (this.state.voteRound + 1) % 3;
      this.setState({
        voteRound,
        lastRoundDelegates: delegateString,
      });
    }
  }

  updateNodeEventAndRadius() {
    if (JSON.stringify(this.state.node) === '{}') {
      return;
    }
    this.state.node
    .on('mousemove', d => {
      switch (d.type) {
        case 'CURRENT_PRODUCER':
          this.setState({label: 'Current Block Producer'});
          break;
        case 'OFFLINE':
          this.setState({label: 'Offline Delegates'});
          break;
        case 'DELEGATES':
          this.setState({label: '7 Current Delegates To Produce And Verify Blocks'});
          break;
        default:
          this.setState({label: '21 Candidate Delegates'});
      }
    })
    .attr('r', d => {
      switch (d.type) {
        case 'CURRENT_PRODUCER':
          return RADIUS.delegate;
        case 'OFFLINE':
          return RADIUS.candidate;
        case 'DELEGATES':
          return RADIUS.delegate;
        default:
          return RADIUS.candidate;
    }});
  }

  componentWillReceiveProps() {
    lazyLoadD3(d3 => {
      this.updateType();
      this.updateVoteRound();
      this.updateNodeEventAndRadius();
      this.setState({startTime: new Date()});
    });
  }

  componentWillUnmount() {
    window.clearInterval(this.state.flash);
  }

  componentDidMount() {
    lazyLoadD3(d3 => {
      const height = HEIGHT;
      const width = WIDTH;
      const projection = d3.geoOrthographic()
        .scale(height * 0.55)
        .translate([width / 2, height / 2])
        .clipAngle(180)
        .precision(1);
      const path = d3.geoPath().projection(projection);

      d3.select('#globe')
        .style('height', `${height}px`)
        .attr('width', `${height * 1.05 }px`);

      const svg = d3.select('#plasma_ball').append('svg')
        .attr('width', width)
        .attr('height', height);
      const g = svg.append('g')
        .attr('class', 'everything');

      g.append('path')
        .attr('class', 'graticule')
        .attr('d', path)
        .style('stroke', '#4f5b5b')
        .style('stroke-width', '1px')
        .attr('fill-opacity', '0.0');

      this.updateType();
      this.updateVoteRound();

      const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(nodes_data)
        .enter()
        .append('circle')
        .on('mouseout', d => {
          this.setState({label: ''});
        })
        .attr('cx', d => {
          return d.x;
        })
        .attr('cy', d => {
          return d.y;
        });

      const flash = window.setInterval(() => updateNodeColor(this), 500);
      this.setState({node, flash});

      this.updateNodeEventAndRadius();

      function updateNodeColor(obj) {
        node.attr('fill', d => {
          switch (d.type) {
            case 'CURRENT_PRODUCER':
              const time = new Date();
              if (Math.floor((time - obj.state.startTime) / 500) % 2 !== 0) {
                return COLOR.delegate[obj.state.voteRound];
              } else {
                return COLOR.candidate;
              }
            case 'OFFLINE':
              return COLOR.grey;
            case 'DELEGATES':
              return COLOR.delegate[obj.state.voteRound];
            default:
              return COLOR.candidate;
        }});
      }
    })
  }

  render() {
    return (
      <div style={{paddingTop: '50px'}}>
        <div className='level'>
          <div className='level-item has-text-centered' style={`height:${HEIGHT+20}px;position:relative;padding:10px 0`}>
            <div style='position:absolute;width: 310px;height:310px'>
              <img id='globe'
                  style='position:relative;'
                  src={assetURL('/globe.png')}
              />
            </div>
            <div id='plasma_ball' style='width:100%;height:100%;position:absolute;z-index:2'/>
          </div>
        </div>
        <div style='color:white;position:relative;left:5%;bottom:10px;height:22px'>{this.state.label}</div>
      </div>
    );
  }
}
