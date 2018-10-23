// @flow

import Component from 'inferno-component';
import {Link} from 'inferno-router';
import {styled} from 'styletron-inferno';
import type {Error} from '../../entities/common-types';
import {t} from '../../lib/iso-i18n';
import {EmptyMessage, ErrorMessage, LoadingMessage} from './message';

export class TableWrapper extends Component {
  props: {
    error: Error,
    offset: number,
    count: number,
    name: string,
    fetching: boolean,
    tip: number,
    items: Array<any>,
    id: string,
    fetch: any,
    displayPagination: boolean,
    displayViewMore: boolean,
    children: any,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      fetched: false,
    };
  }

  componentWillReceiveProps(nextProps: {fetching: boolean}, nextContext: any) {
    if (!nextProps.fetching && !this.state.fetched) {
      this.setState({fetched: true});
    }
  }

  // eslint-disable-next-line max-params,complexity
  pagination(offset: number, items: Array<any>, count: number, id: string, fetching: boolean, fetch: any, tip: number) {
    if (offset === 0 && (!items || (items && items.length < count))) {
      return null;
    }

    return (
      <div>
        <br/>
        <div className='field is-grouped is-grouped-centered'>
          <p className='control'>
            <Button className={`button ${offset === 0 || fetching ? 'is-static static-button' : ''}`}
              onClick={() => {
                fetch({
                  offset: offset - count,
                  count,
                  tip,
                  id: id || '',
                });
                this.setState({fetched: false});
              }}>{t('meta.previous')}
            </Button>
          </p>
          <p className='control'>
            <Button className={`button ${fetching || (!items || items && items.length < count) ? 'is-static static-button' : ''}`}
              onClick={() => {
                fetch({
                  offset: offset + count,
                  count,
                  tip,
                  id: id || '',
                });
                this.setState({fetched: false});
              }}>{t('meta.next')}</Button>
          </p>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line complexity
  render() {
    const {offset, count, items, name, children, displayPagination, displayViewMore, fetching, error, fetch, tip, id} = this.props;
    const {fetched} = this.state;

    // only show loading if it's the first fetch
    if (fetching && !fetched) {
      return (<LoadingMessage fakeRows={true}/>);
    }
    if (error) {
      return (
        <ErrorMessage
          error={error}
        />
      );
    }

    return (
      <div>
        {!items || items.length === 0 ? <EmptyMessage item={name} more={offset !== 0}/> : <div>{children}</div>}
        {displayPagination && this.pagination(offset, items, count, id, fetching, fetch, tip)}
        {displayViewMore && items && items.length === count &&
          <div>
            <br/>
            <div className='field is-grouped is-grouped-centered'>
              <p className='control'>
                <Link to={`/${name}`} className='link force-teal'>{t('meta.all')} {name}</Link>
              </p>
            </div>
          </div>
        }
      </div>
    );
  }
}

const Button = styled('a', {
  color: '#fcfdfc',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  borderColor: '#73fbe1',
  backgroundColor: '#151b21',
  display: 'block',
  ':hover': {
    color: '#151b21',
    backgroundColor: '#73fbe1',
    borderColor: '#73fbe1',
  },
  transition: 'all 0.2s ease',
});
