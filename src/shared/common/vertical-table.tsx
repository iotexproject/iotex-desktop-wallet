import Col from "antd/lib/col";
import Divider from "antd/lib/divider";
import Row from "antd/lib/row";
import { t } from "onefx/lib/iso-i18n";
import React, { CSSProperties, useState } from "react";
import { LinkButton } from "./buttons";
import { SpinPreloader } from "./spin-preloader";

export function numberWithCommas(n: string): string {
  const parts = n.toString().split(".");
  return (
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (parts[1] ? `.${parts[1]}` : "")
  );
}

export interface IVerticalTableKeyPair<T> {
  key: string;
  value: T;
}

export interface IVerticalTableRendererProps<T> {
  value: T;
  record?: IVerticalTableKeyPair<T>;
  index?: number;
}

export type VerticalTableRender<T> = React.FC<IVerticalTableRendererProps<T>>;

// tslint:disable-next-line:no-any
export interface IVerticalTableProps<T = any> {
  objectSource: { [index: string]: T };
  maxRowsCount?: number;
  showMoreRender?(expanded: boolean): JSX.Element;
  headerRender?(
    value: string,
    record: IVerticalTableKeyPair<T>,
    index: number
  ): JSX.Element | string;
  valueRender?: VerticalTableRender<T>;
  // tslint:disable-next-line:no-any
  valueRenderMap?: { [index: string]: VerticalTableRender<any> };
  style?: CSSProperties;
  className?: string;
  loading?: boolean;
}

// tslint:disable-next-line:no-any
function VerticalTable<T = any>(props: IVerticalTableProps<T>): JSX.Element {
  const {
    objectSource,
    className,
    style,
    maxRowsCount,
    showMoreRender,
    valueRenderMap,
    valueRender,
    headerRender,
    loading
  } = props;
  const [expanded, setExpanded] = useState(false);

  const dataSource = Object.keys(objectSource)
    .map(
      (key: string): IVerticalTableKeyPair<T> => ({
        key,
        value: objectSource[key]
      })
    )
    .slice(0, expanded ? undefined : maxRowsCount);
  const moreIcon = expanded ? "up" : "down";
  const showMore = (showMoreRender && showMoreRender(expanded)) || (
    <LinkButton icon={moreIcon} style={{ padding: "0px 8px" }}>
      {t(expanded ? "common.show_less" : "common.show_more")}
    </LinkButton>
  );
  const totalRowCount = dataSource.length;

  return (
    <div className={`vertical-table ${className || ""}`} style={style}>
      <SpinPreloader spinning={!!loading}>
        <div>
          {dataSource.map((record, index) => {
            const header = headerRender
              ? headerRender(record.key, record, index)
              : `${record.key}`;
            const valRender =
              (valueRenderMap && valueRenderMap[record.key]) ||
              valueRender ||
              null;
            const value =
              record.value === undefined
                ? ""
                : (valRender &&
                    valRender({ value: record.value, record, index })) ||
                  `${record.value}`;
            return (
              <Row key={`vtable-row-${index}`}>
                {index > 0 && (
                  <Row>
                    <Col xs={24} sm={24} md={0}>
                      <Divider style={{ padding: 0, margin: 0 }} />
                    </Col>
                  </Row>
                )}
                <Row
                  key={`vtable-row-${record.key}-${index}`}
                  type="flex"
                  align="top"
                  justify="start"
                  className="vtable-row"
                  style={{ padding: "8px 5px" }}
                >
                  <Col xs={24} sm={24} md={0}>
                    <strong>{header}</strong>
                  </Col>
                  <Col xs={0} md={6} lg={4} xxl={3}>
                    {header}
                  </Col>
                  <Col xs={24} sm={24} md={18} lg={20} xxl={21}>
                    {value}
                  </Col>
                </Row>
              </Row>
            );
          })}
          {maxRowsCount && maxRowsCount < totalRowCount && (
            <Row
              role="main"
              onClick={() => {
                setExpanded(!expanded);
              }}
              style={{ marginTop: 20, cursor: "pointer" }}
            >
              {showMore}
            </Row>
          )}
        </div>
      </SpinPreloader>
    </div>
  );
}

export { VerticalTable };
