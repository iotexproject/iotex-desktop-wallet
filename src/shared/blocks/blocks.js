// @flow

import Component from 'inferno-component';
import Helmet from 'inferno-helmet';
import {Link} from 'inferno-router';
import isBrowser from 'is-browser';
import {CommonMargin} from '../common/common-margin';
import type {TBlock} from '../../entities/explorer-types';
import {TableWrapper} from '../common/table-wrapper';
import {ellipsisText, hideColClass, singleColEllipsisText} from '../common/utils';
import {t} from '../../lib/iso-i18n';
import {EmptyMessage} from '../common/message';
import type {Error} from '../../entities/common-types';
import {fromNow} from '../common/from-now';
import {fetchBlocks} from './blocks-actions';

type PropsType = {
  statistic: {
    height: number,
  },
};

export class Blocks extends Component {
  props: {
    fetchBlocks: fetchBlocks,
    statistic: {
      height: number,
    },
    state: {
      items: Array<TBlock>,
      fetching: boolean,
      error: Error,
      offset: number,
      count: number,
      height: number,
      tip: number,
    },
    width: number,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      height: 0,
    };
  }

  componentWillMount() {
    if (isBrowser) {
      this.props.fetchBlocks({tip: this.state.height, offset: 0, count: this.props.state.count});
    }
  }

  componentWillReceiveProps(nextProps: PropsType, nextContext: any) {
    if (nextProps.statistic && this.state.height !== nextProps.statistic.height) {
      this.setState(state => {
        state.height = nextProps.statistic.height;
      }, () => {
        if (this.props.state.offset === 0) {
          this.props.fetchBlocks({tip: this.state.height, offset: 0, count: this.props.state.count});
        }
      });
    }
  }

  render() {
    return (
      <div className='column container'>
        <Helmet
          title={`${t('blocks.title')} - IoTeX`}
        />
        <h1 className='title'>{t('blocks.title')}</h1>
        <TableWrapper
          fetching={this.props.state.fetching}
          error={this.props.state.error}
          offset={this.props.state.offset}
          count={this.props.state.count}
          items={this.props.state.items}
          fetch={this.props.fetchBlocks}
          tip={this.props.state.tip}
          name={t('blocks.title')}
          displayPagination={true}
        >
          {<BlocksListOnlyId
            blocks={this.props.state.items}
            width={this.props.width}
            isHome={false}
          />}
        </TableWrapper>
        <CommonMargin/>
      </div>
    );
  }
}

export class BlocksList extends Component {
  render() {
    let blocks: Array<TBlock> = this.props.blocks;
    if (!blocks) {
      return (
        <EmptyMessage item={t('blocks.title')}/>
      );
    }
    if (!Array.isArray(blocks)) {
      blocks = [blocks];
    }
    return (
      <table className='bx--data-table-v2'>
        <thead>
          <tr>
            <th className={hideColClass(this.props.width) ? 'first-col' : 'none-on-palm'}>{t('meta.id')}</th>
            <th className={hideColClass(this.props.width) ? '' : 'second-to-none-header'}>{t('meta.height')}</th>
            <th className={hideColClass(this.props.width) ? '' : 'none-on-palm'}>{t('meta.timestamp')}</th>
            <th>{t('meta.transactions')}</th>
            <th>{t('block.generatedBy')}</th>
            <th className={hideColClass(this.props.width) ? '' : 'none-on-palm'}>{t('meta.amount')}</th>
            <th>{t('blocks.forged')}</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((b: TBlock) => (
            <tr className='bx--parent-row-v2' data-parent-row>
              <td className={hideColClass(this.props.width) ? 'first-col' : 'none-on-palm'}><Link to={`/blocks/${b.id}`} className='link'>{ellipsisText(b.id, this.props.width)}</Link></td>
              <td className={hideColClass(this.props.width) ? '' : 'second-to-none'}>
                {hideColClass(this.props.width) ? b.height : <Link to={`/blocks/${b.id}`} className='link'>{b.height}</Link>}
              </td>
              <td className={hideColClass(this.props.width) ? '' : 'none-on-palm'}>{fromNow(b.timestamp)}</td>
              <td>{b.transfers}</td>
              <td>
                {b.generateBy ? ellipsisText(b.generateBy.name, this.props.width) || ellipsisText(b.generateBy.address, this.props.width) : ''}
              </td>
              <td className={hideColClass(this.props.width) ? '' : 'none-on-palm'}>{b.amount}</td>
              <td>{b.forged}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export class BlocksListOnlyId extends Component {
  props: {
    blocks: Array<TBlock>,
    width: string,
    isHome: boolean,
  };

  render() {
    let blocks: Array<TBlock> = this.props.blocks;
    if (!blocks) {
      return null;
    }
    if (!Array.isArray(blocks)) {
      blocks = [blocks];
    }
    return (
      <table className='bx--data-table-v2'>
        <thead>
          <tr>
            <th className='single-col-header'>{t('block.id')}</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((b: TBlock) => (
            <tr className='bx--parent-row-v2' data-parent-row>
              <td className='single-col-row'><Link to={`/blocks/${b.id}`} className='link'>{singleColEllipsisText(b.id, this.props.width, this.props.isHome)}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
