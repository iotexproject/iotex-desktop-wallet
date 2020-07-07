import Button from "antd/lib/button";
import Form from "antd/lib/form";
import { WrappedFormUtils } from "antd/lib/form/Form";
import Icon from "antd/lib/icon";
import Input from "antd/lib/input";
import Popover from "antd/lib/popover";
import Table from "antd/lib/table";
import { styled } from "onefx/lib/styletron-react";
import React from "react";

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

// @ts-ignore
const EditableContext = React.createContext();

class EditableCell extends React.Component<EditableCellProps> {
  public getInput = () => {
    return <Input />;
  };

  public renderCell = ({
    getFieldDecorator
  }: {
    getFieldDecorator: any;
  }): JSX.Element => {
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
          inputType === "text" ? (
            <Form.Item style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: true,
                    message: `Please Input ${title}!`
                  }
                ],
                initialValue: record[dataIndex]
              })(this.getInput())}
            </Form.Item>
          ) : (
            children
          )
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

interface Record {
  key: string;
  name: string;
  members: string;
  isOld: boolean;
  isAdminGroup: boolean;
  [key: string]: any;
}

interface State {
  editingKey: string;
  data: Array<Record>;
}

interface Props {
  form: WrappedFormUtils;
}

class AdminGroupMode extends React.Component<Props, State> {
  private readonly columns: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      editingKey: "",
      data: [
        {
          key: "0",
          name: "Administrators",
          members: "20",
          isOld: true,
          isAdminGroup: true
        },
        {
          key: "1",
          name: "All Users",
          members: "20",
          isOld: true,
          isAdminGroup: true
        },
        {
          key: "2",
          name: "hey1",
          members: "0",
          isOld: true,
          isAdminGroup: false
        }
      ]
    };
    this.columns = [
      {
        title: "Group name",
        dataIndex: "name",
        width: "30%",
        editable: true
      },
      {
        title: "Members",
        dataIndex: "members",
        width: "30%",
        editable: true
      },
      {
        title: "operation",
        dataIndex: "operation",
        render: (_: string, record: Record) => {
          const { isAdminGroup } = record;
          const editable = this.isEditing(record);
          if (isAdminGroup) {
            return null;
          }
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {(form: WrappedFormUtils) => (
                  <span
                    role="button"
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </span>
                )}
              </EditableContext.Consumer>
              <span role="button" onClick={() => this.cancel(record.key)}>
                Cancel
              </span>
            </span>
          ) : (
            <Popover
              placement="bottom"
              title={null}
              content={
                <div>
                  <PopoverItem onClick={() => this.edit(record.key)}>
                    Edit User
                  </PopoverItem>
                  <PopoverItem
                    style={{
                      color: "red"
                    }}
                  >
                    Remove Group
                  </PopoverItem>
                </div>
              }
              trigger="click"
            >
              <Icon
                type="ellipsis"
                style={{ color: "#C7CFD5", fontSize: "40px" }}
              />
            </Popover>
          );
        }
      }
    ];
  }
  public isEditing = (record: Record) => record.key === this.state.editingKey;

  public cancel = (key: string) => {
    const obj = this.state.data.find(dataItem => dataItem.key === key);
    if (obj && obj.isOld) {
      this.setState({ editingKey: "" });
    } else {
      this.state.data.splice(Number(key), 1);
      this.state.data.forEach((item, index) => {
        item.key = String(index);
      });
      this.setState({ editingKey: "", data: this.state.data });
    }
  };

  public addRow = () => {
    this.state.data.unshift({
      key: "0",
      name: "",
      members: "",
      isOld: false,
      isAdminGroup: false
    });
    this.state.data.forEach((item, index) => {
      item.key = String(index);
    });
    this.setState({
      data: this.state.data,
      editingKey: "0"
    });
  };

  public save(form: WrappedFormUtils, key: string): void {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const indexItem: Record = newData.find(
        item => key === item.key
      ) as Record;
      const index = Number(indexItem.key);
      let newRow = row;
      if (!indexItem.isOld) {
        newRow = { ...row, members: 0 };
      }
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...newRow
        });
        this.setState({ data: newData, editingKey: "" });
      } else {
        newData.push(newRow);
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }

  public edit(key: string): void {
    this.setState({ editingKey: key });
  }
  public render(): JSX.Element | null {
    const components = {
      body: {
        cell: EditableCell
      }
    };

    const columns = this.columns.map(
      (col: { editable: boolean; dataIndex: string; title: string }) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: Record) => {
            return {
              record,
              inputType: col.dataIndex === "name" ? "text" : "member",
              dataIndex: col.dataIndex,
              title: col.title,
              editing: this.isEditing(record)
            };
          }
        };
      }
    );
    return (
      <EditableContext.Provider value={this.props.form}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            height: 33,
            lineHeight: "33px",
            paddingLeft: 14
          }}
        >
          <h3>Groups</h3>
          <Button type="primary" onClick={this.addRow}>
            Create a group
          </Button>
        </div>
        <div style={{ color: "#2e353b", paddingLeft: 14 }}>
          You can use groups to control your users' access to your data. Put
          users in groups and then go to the Permissions section to control each
          group's access. The Administrators and All Users groups are special
          default groups that can't be removed.
        </div>
        <Table
          components={components}
          columns={columns}
          dataSource={this.state.data}
        />
      </EditableContext.Provider>
    );
  }
}

const WrapperAdminGroupMode = Form.create()(AdminGroupMode);
const PopoverItem = styled("div", {
  padding: "20px 10px",
  color: "#74838f",
  fontSize: "14px",
  cursor: "pointer",
  fontWeight: 700,
  width: "150px"
});
export default WrapperAdminGroupMode;
