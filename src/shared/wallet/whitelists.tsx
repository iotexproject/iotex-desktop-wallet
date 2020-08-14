import { styled } from "onefx/lib/styletron-react";
import React from "react";

import Divider from "antd/lib/divider";
import { FormComponentProps } from "antd/lib/form";
import Form from "antd/lib/form";
import { WrappedFormUtils } from "antd/lib/form/Form";
import Input from "antd/lib/input";
import InputNumber from "antd/lib/input-number";
import Popconfirm from "antd/lib/popconfirm";
import Switch from "antd/lib/switch";
import Table from "antd/lib/table";
import { ColumnProps } from "antd/lib/table";
import dayjs from "dayjs";
import { t } from "onefx/lib/iso-i18n";
import { CommonMargin } from "../common/common-margin";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
import { Flex } from "../common/flex";
import { colors } from "../common/styles/style-color";
import { numberWithCommas } from "../common/vertical-table";
import { WhitelistConfig, whitelistService } from "./whitelist";

const P = styled("p", {
  color: colors.black60
});

const A = styled("a", {
  cursor: "pointer"
});

const getRemainTime = (
  deadline: number,
  start: number = Date.now()
): string => {
  const begin = dayjs(start);
  const end = dayjs(deadline);
  const remainHour = end.diff(begin, "hour");
  if (remainHour > 0) {
    return `${remainHour + 1} h`;
  } else {
    return `${end.diff(begin, "minute")} m`;
  }
};

// @ts-ignore
const EditableContext = React.createContext();

interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: string;
  record: Record;
  index: number;
  children: JSX.Element;
  // tslint:disable: no-any
  [key: string]: any;
}

class EditableCell extends React.Component<EditableCellProps> {
  public getInput = () => {
    if (this.props.inputType === "number") {
      return <InputNumber />;
    }
    return <Input />;
  };

  public getValue(dataIndex: string, record: Record): number {
    switch (dataIndex) {
      case "amount":
        return parseInt(record[dataIndex], 10);
      case "deadline": {
        const result = getRemainTime(record[dataIndex]);

        return /h/.test(result) ? parseInt(result, 10) : 0;
      }
      default:
        return NaN;
    }
  }

  public renderCell = ({ getFieldDecorator }: { getFieldDecorator: any }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: this.getValue(dataIndex, record)
            })(this.getInput())}
            {inputType === "number" && <span>{restProps.unit}</span>}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  public render(): JSX.Element {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

interface Record extends WhitelistConfig {
  key: string;
}

interface CustomColumnProps<T> extends ColumnProps<T> {
  editable?: boolean;
}

type WhitelistTableProps = FormComponentProps & {
  dataSource: Array<Record>;
  operate(): void;
};

interface WhitelistTableState {
  editingKey: string;
}

class WhitelistTable extends React.Component<
  WhitelistTableProps,
  WhitelistTableState
> {
  public state: WhitelistTableState = {
    editingKey: ""
  };

  // tslint:disable:max-func-body-length
  private getColumns(): Array<CustomColumnProps<Record>> {
    return [
      {
        title: (
          <div style={{ textAlign: "center" }}>
            {t("wallet.whitelist.title_origin")}/
            <br />
            {t("wallet.whitelist.title_method")}
          </div>
        ),
        dataIndex: "origin",
        width: "20%",
        align: "center",
        className: "x-scroll",
        editable: false,
        key: "origin",
        render: (_, { origin, method }: Record): JSX.Element => (
          <Flex flexWrap="nowrap">
            <div style={{ flex: "1 0 auto", marginRight: 5 }}>
              <CopyButtonClipboardComponent
                icon="copy"
                text={method}
                size="small"
              />
            </div>
            <span>
              {origin}/{method}
            </span>
          </Flex>
        )
      },
      {
        title: (
          <div style={{ textAlign: "center" }}>
            {t("wallet.whitelist.title_amount")}
            <br />
            (IOTX)
          </div>
        ),
        dataIndex: "amount",
        width: "20%",
        align: "center",
        editable: true,
        key: "amount"
      },
      {
        title: t("wallet.whitelist.title_recipient"),
        dataIndex: "recipient",
        width: "25%",
        align: "center",
        className: "x-scroll",
        editable: false,
        key: "recipient"
      },
      {
        title: t("wallet.whitelist.title_remain"),
        dataIndex: "deadline",
        width: "15%",
        align: "center",
        editable: true,
        key: "deadline",
        render: (_: string, record: Record): JSX.Element => (
          <span>{getRemainTime(record.deadline)}</span>
        )
      },
      {
        title: t("wallet.whitelist.title_operation"),
        dataIndex: "operation",
        align: "center",
        width: "20%",
        key: "operation",
        render: (_: string, record: Record): JSX.Element => {
          const editable = this.isEditing(record);
          return editable ? (
            <span style={{ whiteSpace: "nowrap" }}>
              <EditableContext.Consumer>
                {(form: WrappedFormUtils) => (
                  <a
                    onClick={() => this.update(form, record.key)}
                    style={{ marginRight: 8 }}
                    href="void 0"
                    role="main"
                  >
                    {t("wallet.whitelist.operation.save")}
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title={t("wallet.whitelist.operation.alert")}
                onConfirm={() => this.cancel()}
              >
                <A href="void 0" role="main">
                  {t("wallet.whitelist.operation.cancel")}
                </A>
              </Popconfirm>
              <Divider type="vertical" />
              <A href="void 0" role="main" onClick={() => this.remove(record)}>
                {t("wallet.whitelist.operation.delete")}
              </A>
            </span>
          ) : (
            <span>
              <A
                onClick={() => this.edit(record.key)}
                href="void 0"
                role="main"
              >
                {t("wallet.whitelist.operation.edit")}
              </A>
              <Divider type="vertical" />
              <A href="void 0" role="main" onClick={() => this.remove(record)}>
                {t("wallet.whitelist.operation.delete")}
              </A>
            </span>
          );
        }
      }
    ];
  }

  private readonly isEditing = (record: Record): boolean =>
    record.key === this.state.editingKey;

  private readonly cancel = () => {
    this.setState({ editingKey: "" });
  };

  private update(form: WrappedFormUtils, key: string): void {
    form.validateFields((error: any, row: Record) => {
      if (error) {
        return;
      }

      const index = this.props.dataSource.findIndex(item => key === item.key);

      if (index > -1) {
        const {
          origin,
          method,
          recipient,
          deadline,
          amount
        } = this.props.dataSource[index];
        const updatedAmount = row.amount
          ? `${numberWithCommas(row.amount)} IOTX`
          : amount;
        const updatedDeadline = row.deadline
          ? Date.now() + row.deadline * 60 * 60 * 1000
          : deadline;

        if (updatedAmount !== amount || updatedDeadline !== deadline) {
          whitelistService.update(
            {
              origin,
              method,
              recipient,
              amount: updatedAmount,
              deadline: updatedDeadline
            },
            this.props.dataSource[index]
          );
          this.props.operate();
        }
      }
      this.setState({ editingKey: "" });
    });
  }

  private remove(record: Record): void {
    whitelistService.remove(record);
    this.props.operate();
  }

  private edit(key: string): void {
    this.setState({ editingKey: key });
  }

  public render(): JSX.Element {
    const components = {
      body: {
        cell: EditableCell
      }
    };

    const columns = this.getColumns().map((col: CustomColumnProps<Record>) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: Record) => ({
          record,
          inputType: "number",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
          unit: col.dataIndex === "deadline" ? "h" : ""
        })
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered={true}
          dataSource={this.props.dataSource}
          columns={columns}
          locale={{
            emptyText: "No Available Configuration"
          }}
          pagination={false}
          className="whitelist-table"
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create<WhitelistTableProps>()(WhitelistTable);

type Props = {};

interface State {
  checked: boolean;
  operateCount: number; // just for trigger component update immediately
}

export class Whitelists extends React.Component<Props, State> {
  public state: State = {
    checked: true,
    operateCount: 0
  };

  public componentDidMount(): void {
    const checked = whitelistService.isWhitelistEnable();

    this.setState({ checked });
  }

  public render(): JSX.Element {
    const dataSource = whitelistService.getConfigList().map(config => ({
      ...config,
      key: whitelistService.getConfigKey(config)
    }));
    return (
      <>
        <P>{t("wallet.whitelist.intro")}</P>
        <div>
          <span style={{ marginRight: "16px" }}>
            {t("wallet.whitelist.state")}
          </span>
          <Switch
            style={{ textTransform: "uppercase" }}
            checkedChildren={t("wallet.whitelist.enabled")}
            unCheckedChildren={t("wallet.whitelist.disabled")}
            checked={this.state.checked}
            onChange={(checked: boolean) => {
              whitelistService.setWhitelistState(checked);
              this.setState({ checked });
            }}
          />
        </div>
        <CommonMargin />
        <EditableFormTable
          dataSource={dataSource}
          operate={() =>
            this.setState({ operateCount: this.state.operateCount += 1 })
          }
        />
      </>
    );
  }
}
