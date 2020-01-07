import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  Modal,
  Popover,
  Row,
  Table
} from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import WrapperAdminGroupMode from "./admin-people-group";

interface Props {}

interface State {
  isactive: boolean;
  mode?: "people" | "group";
}

interface AdminPeopleModeProps {
  form: WrappedFormUtils;
}

interface AdminPeopleModeState {
  visible: boolean;
  mockGroupList: Array<{ label: string; value: string; isAdminGroup: boolean }>;
  data: Array<Record>;
  editUserIndex: number;
}

interface Record {
  key: string;
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  groups: string;
  lastlogin: string;
  groupArray: Array<string>;
}

class AdminPeopleMode extends React.Component<
  AdminPeopleModeProps,
  AdminPeopleModeState
> {
  constructor(props: AdminPeopleModeProps) {
    super(props);
    this.state = {
      visible: false,
      mockGroupList: [
        {
          label: "Administrators",
          value: "administrators",
          isAdminGroup: true
        },
        { label: "All Users", value: "allusers", isAdminGroup: true },
        { label: "hey1", value: "hey1", isAdminGroup: false },
        { label: "test", value: "test", isAdminGroup: false }
      ],
      data: [
        {
          key: "0",
          name: "Zhe Jun",
          firstname: "Zhe",
          lastname: "Jun",
          email: "1429595365@qq.com",
          groups: "Admin",
          lastlogin: "21 hours ago",
          groupArray: ["hey1", "test"]
        },
        {
          key: "1",
          name: "普通用户 123",
          email: "1234@qq.com",
          firstname: "a",
          lastname: "b",
          groups: "西湖区湖底公园1号",
          lastlogin: "21 hours ago",
          groupArray: ["test"]
        }
      ],
      editUserIndex: -1
    };
  }
  public createGroupMenu = (groupArray: Array<string>) => {
    const { mockGroupList } = this.state;
    const content = mockGroupList.map((groupItem, index: number) => {
      const defaultChecked =
        groupArray.findIndex(item => item === groupItem.value) !== -1 ||
        groupItem.isAdminGroup;
      return (
        <div key={index}>
          <Checkbox
            key={String(index)}
            defaultChecked={defaultChecked}
            disabled={groupItem.isAdminGroup}
          >
            {groupItem.label}
          </Checkbox>
          {index === 1 && <Divider />}
        </div>
      );
    });
    return <div>{content}</div>;
  };
  public setModalVisible = (visible: boolean) => {
    if (!visible) {
      this.setState({ editUserIndex: -1 });
    }
    this.setState({ visible });
  };
  public editUser = (key: number) => {
    this.setState({ visible: true, editUserIndex: key });
  };
  // tslint:disable-next-line:max-func-body-length
  public render(): JSX.Element | null {
    const { getFieldDecorator } = this.props.form;
    const { editUserIndex, data } = this.state;
    const content = (key: number) => (
      <div>
        <AdminPopover onClick={() => this.editUser(key)}>
          Edit User
        </AdminPopover>
        <AdminPopover>Reset password</AdminPopover>
      </div>
    );
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text: string, record: Record) => {
          const str: string =
            record.firstname.slice(0, 1).toUpperCase() +
            record.lastname.slice(0, 1).toUpperCase();
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <AdminTableFirstColumn>{str}</AdminTableFirstColumn>
              {text}
            </div>
          );
        }
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "Groups",
        dataIndex: "groups",
        key: "groups",
        render: (text: string, record: Record) => {
          return (
            <Popover
              placement="bottom"
              content={this.createGroupMenu(record.groupArray)}
              trigger="click"
            >
              <span>
                {text}
                <Icon type="down" />
              </span>
            </Popover>
          );
        }
      },
      {
        title: "Last login",
        dataIndex: "lastlogin",
        key: "lastlogin"
      },
      {
        title: "",
        key: "action",
        render: (_: string, record: Record) => (
          <Popover
            placement="bottom"
            title={null}
            content={content(Number(record.key))}
            trigger="click"
          >
            <Icon type="ellipsis" style={{ color: "#2E353C", fontSize: 30 }} />
          </Popover>
        )
      }
    ];
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: "14px",
            height: 33,
            lineHeight: "33px"
          }}
        >
          <h3>People</h3>
          <Button type="primary" onClick={() => this.setModalVisible(true)}>
            Add someone
          </Button>
        </div>
        <Table columns={columns} dataSource={this.state.data} />
        <Modal
          visible={this.state.visible}
          onCancel={() => this.setModalVisible(false)}
          footer={[<Button key="back">Create</Button>]}
        >
          <div style={{ paddingTop: 10 }}>
            <h1>new user</h1>
            <Form>
              <Form.Item label="FIRST NAME">
                {getFieldDecorator("firstname", {
                  initialValue:
                    editUserIndex !== -1 ? data[editUserIndex].firstname : "",
                  rules: [
                    { required: true, message: "Please input your username!" }
                  ]
                })(<Input placeholder="Username" />)}
              </Form.Item>
              <Form.Item label="LAST NAME">
                {getFieldDecorator("lastname", {
                  initialValue:
                    editUserIndex !== -1 ? data[editUserIndex].lastname : "",
                  rules: [
                    { required: true, message: "Please input your username!" }
                  ]
                })(<Input placeholder="Username" />)}
              </Form.Item>
              <Form.Item label="EMAIL">
                {getFieldDecorator("email", {
                  initialValue:
                    editUserIndex !== -1 ? data[editUserIndex].email : "",
                  rules: [
                    { required: true, message: "Please input your username!" }
                  ]
                })(<Input placeholder="Username" />)}
              </Form.Item>
              <Form.Item label="GROUPS">
                {getFieldDecorator("groups", {
                  rules: [
                    { required: true, message: "Please input your username!" }
                  ]
                })(<Input placeholder="Username" />)}
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}
const WrapperAdminPeopleMode = Form.create()(AdminPeopleMode);

class AdminPeople extends React.Component<Props, State> {
  public state: State = {
    mode: "people",
    isactive: false
  };
  public chooseMode = (mode: "people" | "group") => {
    this.setState({ mode });
  };
  public render(): JSX.Element | null {
    const { mode } = this.state;
    return (
      <AdminWrapper>
        <Row>
          <Col span={6}>
            <AdminPanel>
              <div onClick={() => this.chooseMode("people")}>
                <AdminPanelItem
                  isactive={mode === "people"}
                  className={mode === "people" ? "people_admin_inactive" : ""}
                >
                  People
                </AdminPanelItem>
              </div>
              <div onClick={() => this.chooseMode("group")}>
                <AdminPanelItem
                  isactive={mode === "group"}
                  className={mode === "group" ? "people_admin_inactive" : ""}
                >
                  Groups
                </AdminPanelItem>
              </div>
            </AdminPanel>
          </Col>
          <Col span={18}>
            {mode === "people" ? (
              <WrapperAdminPeopleMode />
            ) : (
              <WrapperAdminGroupMode />
            )}
          </Col>
        </Row>
      </AdminWrapper>
    );
  }
}
const AdminWrapper = styled("div", {
  padding: "50px"
});
const AdminPanel = styled("div", {
  backgroundColor: "#f9fbfc",
  border: "1px solid #f0f0f0",
  borderRadius: "4px",
  width: "266px",
  boxShadow: "inset -1px -1px 3px rgba(0, 0, 0, .13)",
  paddingBottom: "0.75em",
  paddingTop: "0.75em"
});
const AdminPanelItem = styled("a", (props: State) => ({
  height: "40px",
  display: "flex",
  alignItems: "center",
  padding: "14px 10px",
  color: props.isactive ? "#509ee3" : "#2e353b",
  cursor: "pointer",
  marginBottom: "0.25em",
  ":hover": {
    backgroundColor: "white",
    borderColor: "#f0f0f0",
    marginLeft: "-7px",
    marginRight: "-7px",
    paddingLeft: "21px",
    paddingRight: "21px",
    boxShadow: " 0 1px 2px rgba(0, 0, 0, .13)"
  }
}));
const AdminPopover = styled("div", {
  padding: "20px 10px",
  color: "#74838f",
  fontSize: "14px",
  cursor: "pointer",
  fontWeight: 700,
  width: "150px"
});
const AdminTableFirstColumn = styled("div", {
  width: "42px",
  height: "42px",
  backgroundColor: "#a989c5",
  color: "white",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "15px"
});
export { AdminPeople };
