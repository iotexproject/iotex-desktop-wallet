// @flow

import Component from 'inferno-component';
import {t} from '../../lib/iso-i18n';
import {ToolTip} from '../common/tooltip';

export class Dashboard extends Component {
  props: {
    stats: Array<any>,
  };

  render() {
    const stats = this.props.stats;
    const ss = [];
    let idx = 0;
    if (stats.length % 2) {
      idx = 1;
      ss.push([stats[0]]);
    }
    while (idx < stats.length) {
      ss.push([stats[idx], stats[idx + 1]]);
      idx += 2;
    }
    return (
      <div className='column dashboard-wrap'>
        {
          ss.map(row => {
            return (
              <div className='tile is-ancestor'>
                {row.map(s => (
                  <div className='tile is-parent'>
                    <article className='tile is-child box box-custom'>
                      <div>
                        <p className='subtitle force-teal dashboard-title'>{s.title}</p>
                        <ToolTip
                          iconClass={s.icon}
                          message={t(s.msg)}
                          customPadClass={'dashboard-tooltip'}
                        />
                      </div>
                      <p className='title has-text-centered'>{s.subtitle}</p>
                    </article>
                  </div>
                ))}
              </div>
            );
          })
        }
      </div>
    );
  }
}
