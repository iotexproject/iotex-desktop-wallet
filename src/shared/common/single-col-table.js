// @flow

import Component from 'inferno-component';
import {TableWrapper} from '../common/table-wrapper';
import type {Error} from '../../entities/common-types';

export class SingleColTable extends Component {
  props: {
    title: ?string,
    fetching: boolean,
    error: Error,
    offset: number,
    count: number,
    tip: ?number,
    items: any,
    fetch: boolean,
    name: string,
    children: any,
    displayPagination: boolean,
    displayViewMore: boolean,
    id: string,
  };

  render() {
    return (
      <div className='single-col-table'>
        {this.props.title ?
          <h1 className='title'>{this.props.title}</h1> : null
        }
        <TableWrapper
          fetching={this.props.fetching}
          error={this.props.error}
          offset={this.props.offset}
          count={this.props.count}
          tip={this.props.tip}
          items={this.props.items}
          fetch={this.props.fetch}
          name={this.props.name}
          displayPagination={this.props.displayPagination || false}
          displayViewMore={this.props.displayViewMore || false}
          id={this.props.id}
        >
          {this.props.children}
        </TableWrapper>
      </div>
    );
  }
}
