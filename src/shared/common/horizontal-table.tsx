import { get } from "dottie";
import { Component } from "react";
import React from "react";

// tslint:disable:no-any
export interface Column<T> {
  title?: React.ReactNode;
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
        {columns.map((column: Column<any>) => {
          return (
            <React.Fragment>
              <dt>{column.title}</dt>
              <dd>{this.renderCell(column)}</dd>
            </React.Fragment>
          );
        })}
      </dl>
    );
  }
}
