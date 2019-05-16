import { Modal } from "antd";
import { Button } from "./button";

import React from "react";
import { Component } from "react";
import axios from "axios";
// @ts-ignore
import platform from "platform";
import { colors } from "./styles/style-color";

const apiUrl =
  "https://api.github.com/repos/iotexproject/iotex-explorer/releases/latest";

type Props = {
  visible: boolean;
  closeModal: Function;
};
type State = {
  downloadLink: string;
};

class SignInModal extends Component<Props, State> {
  public state: State = {
    downloadLink: "https://github.com/iotexproject/iotex-explorer/releases"
  };

  async componentDidMount() {
    const axiosInstance = axios.create({ timeout: 5000 });
    const resp = await axiosInstance.get(apiUrl);

    let packages = { mac: "", linux: "", window: "" };
    if (resp.status === 200 && resp.data.assets) {
      resp.data.assets.forEach((item: any) => {
        if (/mac.zip$/.test(item.name)) {
          packages.mac = item.browser_download_url;
        }
        if (/.snap$/.test(item.name)) {
          packages.linux = item.browser_download_url;
        }
        if (/.exe$/.test(item.name)) {
          packages.window = item.browser_download_url;
        }
      });

      const osName = (platform.os && platform.os.family) || "";
      if (osName === "OS X") {
        packages.mac && this.setState({ downloadLink: packages.mac });
      } else if (
        osName === "Ubuntu" ||
        osName === "Debian" ||
        osName === "Fedora" ||
        osName === "Red Hat" ||
        osName === "SuSE"
      ) {
        packages.linux && this.setState({ downloadLink: packages.linux });
      } else if (
        osName.indexOf("Windows") !== -1 &&
        osName !== "Windows Phone"
      ) {
        packages.window && this.setState({ downloadLink: packages.window });
      }
    }
  }

  public render() {
    const { visible, closeModal } = this.props;
    const { downloadLink } = this.state;
    return (
      <Modal
        title={<b>IoTeX Wallet</b>}
        visible={visible}
        width={550}
        onCancel={() => closeModal()}
        footer={[
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              key="switch"
              secondary
              width="220px"
              onClick={() => closeModal()}
            >
              Sign In with IoTeX Wallet
            </Button>
            <Button key="logout" width="260px">
              <a style={{ color: colors.white }} href={downloadLink}>
                Haven't installed yet? Download
              </a>
            </Button>
          </div>
        ]}
      />
    );
  }
}

export { SignInModal };
