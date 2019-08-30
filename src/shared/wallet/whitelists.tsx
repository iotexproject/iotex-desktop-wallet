import { styled } from "onefx/lib/styletron-react";
import React from "react";

// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { colors } from "../common/styles/style-color";
import { CommonMargin } from "../common/common-margin";
import {
  Switch,
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Divider
} from "antd";
import { whitelistService, WhitelistConfig } from "./whitelist";
import { ColumnProps } from "antd/lib/table";
import { FormComponentProps } from "antd/lib/form";
import { WrappedFormUtils } from "antd/lib/form/Form";
import dayjs from "dayjs";

type Props = {};

interface State {
  checked: boolean;
}

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
    return `${remainHour} h`;
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
  getInput = () => {
    if (this.props.inputType === "number") {
      return <InputNumber />;
    }
    return <Input />;
  };

  getValue(dataIndex: string, record: Record): number {
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

  renderCell = ({ getFieldDecorator }: { getFieldDecorator: any }) => {
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
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
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
};

interface WhitelistTableState {
  editingKey: string;
}

class WhitelistTable extends React.Component<
  WhitelistTableProps,
  WhitelistTableState
> {
  state: WhitelistTableState = {
    editingKey: ""
  };

  getColumns(): CustomColumnProps<Record>[] {
    return [
      {
        title: t("wallet.whitelist.origin"),
        dataIndex: "origin",
        width: "20%",
        align: "center",
        className: "x-scroll",
        editable: false,
        render: (_, { origin, method }: Record): JSX.Element => (
          <span>
            {origin}/{method}
          </span>
        )
      },
      {
        title: t("wallet.whitelist.amount"),
        dataIndex: "amount",
        width: "17%",
        align: "center",
        editable: true
      },
      {
        title: t("wallet.whitelist.recipient"),
        dataIndex: "recipient",
        width: "25%",
        align: "center",
        className: "x-scroll",
        editable: false
      },
      {
        title: t("wallet.whitelist.remain"),
        dataIndex: "deadline",
        width: "15%",
        align: "center",
        editable: true,
        render: (_: string, record: Record): JSX.Element => (
          <span>{getRemainTime(record.deadline)}</span>
        )
      },
      {
        title: t("wallet.whitelist.operation.operation"),
        dataIndex: "operation",
        align: "center",
        width: "20%",
        render: (_: string, record: Record): JSX.Element => {
          // const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span style={{ whiteSpace: "nowrap" }}>
              <EditableContext.Consumer>
                {(form: WrappedFormUtils) => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
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
              <A href="void 0" role="main">
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
              <A href="void 0" role="main">
                {t("wallet.whitelist.operation.delete")}
              </A>
            </span>
          );
        }
      }
    ];
  }

  isEditing = (record: Record): boolean => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: "" });
  };

  save(form: WrappedFormUtils, key: string) {
    form.validateFields((error: any, row: Record) => {
      if (error) {
        return;
      }
      const newData = [...this.props.dataSource];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
      } else {
        newData.push(row);
      }

      console.log("%c new data:", "color: blue", newData);

      this.setState({ editingKey: "" });
    });
  }

  edit(key: string) {
    this.setState({ editingKey: key });
  }

  render() {
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
          inputType: col.dataIndex === "duration" ? "number" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
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

const EditableFormTable = Form.create()(WhitelistTable);

export class Whitelists extends React.Component<Props, State> {
  public state: State = {
    checked: true
  };

  public componentDidMount() {
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
        <EditableFormTable dataSource={dataSource} />
      </>
    );
  }
}
