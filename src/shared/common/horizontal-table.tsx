import { get } from "dottie";
import { Component } from "react";
import React from "react";

/**
 *  Use this component similar as less params antd-table component.
 *  Columns decide what & how & the order.
 *  Column<T> in Columns[] has 3 params at most: (title, dataIndex, render), 2 params at lest : (title, dataIndex).
 *  DataSource should be object,we match the value by dataIndex and handle it by pass to Column:render function if needs.
 *  Title show in <dt> && value show in <dd>
 */

// tslint:disable:no-any
export interface Column<T> {
  title: React.ReactNode;
  dataIndex: string;
  render?(text: any, record: T): React.ReactNode;
}

// tslint:disable:no-any
export interface Props {
  dataSource: any;
  columns: Array<Column<any>>;
}

export class HorizontalTable extends Component<Props> {
  public renderCell(column: Column<any>): JSX.Element | string | {} {
    const { dataIndex, render } = column;
    const { dataSource } = this.props;
    let text;
    if (!dataIndex || dataIndex.length === 0) {
      text = dataSource;
    } else {
      text = get(dataSource, dataIndex);
    }

    if (render) {
      text = render(text, dataSource);
    }

    return text;
  }

  public render(): JSX.Element {
    const { columns } = this.props;

    return (
      <dl className={"dl-horizontal"}>
        {columns.map((column: Column<any>, index: number) => {
          return (
            <React.Fragment key={index}>
              <dt>{column.title}</dt>
              <dd className={"dd-custom-scroll"}>{this.renderCell(column)}</dd>
            </React.Fragment>
          );
        })}
      </dl>
    );
  }
}
