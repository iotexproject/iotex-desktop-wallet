// @flow

import Component from 'inferno-component';
import {t} from '../../lib/iso-i18n';
import {ToolTip} from '../common/tooltip';

export class Dashboard extends Component {
  props: {
    epochs: number,
    blocks: number,
    executions: number,
    transfers: number,
    votes: number,
    faps: number,
    bbh: number,
  };

  render() {
    const stats = [
      [
        {
          title: t('dashboard.blocks'),
          subtitle: this.props.blocks,
          icon: 'fas fa-question-circle',
          msg: 'dashboard.blocksMsg',
        },
      ], [
        {
          title: t('dashboard.transfers'),
          subtitle: this.props.transfers,
          icon: 'fas fa-question-circle',
          msg: 'dashboard.transfersMsg',
        },
        {
          title: t('dashboard.epochs'),
          subtitle: this.props.epochs,
          icon: 'fas fa-question-circle',
          msg: 'dashboard.epochsMsg',
        },
      ], [
        {
          title: `${t('dashboard.executions')}`,
          subtitle: this.props.executions,
          icon: 'fas fa-question-circle',
          msg: 'dashboard.executionsMsg',
        },
        {
          title: t('dashboard.faps'),
          subtitle: this.props.faps,
          icon: 'fas fa-question-circle',
          msg: 'dashboard.fapsMsg',
        },
      ], [
        {
          title: t('dashboard.votes'),
          subtitle: this.props.votes,
          icon: 'fas fa-question-circle',
          msg: 'dashboard.votesMsg',
        },
        {
          title: t('dashboard.bbh'),
          subtitle: this.props.bbh,
          icon: 'fas fa-question-circle',
          msg: 'dashboard.bbhMsg',
        },
      ],
    ];

    return (
      <div className='column dashboard-wrap'>
        {
          stats.map(row => {
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
