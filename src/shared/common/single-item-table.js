// @flow

import Component from 'inferno-component';
import type {Row} from '../../entities/common-types';

export class SingleItemTable extends Component {
  props: {
    subtitle: ?string,
    rows: Array<any>,
  };

  render() {
    return (
      <div className='single-col-table'>
        {this.props.subtitle ?
          <table className='bx--data-table-v2'>
            <thead>
              <tr className='bx--parent-row-v2' data-parent-row>
                <th className='single-col-header'>{this.props.subtitle}</th>
              </tr>
            </thead>
          </table> : null
        }
        <table className='bx--data-table-v2'>
          <tbody>
            {this.props.rows.map((r: Row) => (
              <tr className='bx--parent-row-v2' data-parent-row>
                <td className='header-col'>{r.c1}</td>
                <td>{r.c2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
