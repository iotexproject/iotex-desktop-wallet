import { Modal } from "antd";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { Button } from "./button";

import axios from "axios";
// @ts-ignore
import platform from "platform";
import React from "react";
import { Component } from "react";

const GITHUB_API_URL =
  "https://api.github.com/repos/iotexproject/iotex-explorer/releases/latest";

const DEFAULT_DOWNLOAD_LINK =
  "https://github.com/iotexproject/iotex-explorer/releases";

type Props = {
  visible: boolean;
  closeModal(): void;
};
type State = {
  downloadLink: string;
};

class SignInModal extends Component<Props, State> {
  public state: State = {
    downloadLink: DEFAULT_DOWNLOAD_LINK
  };

  public async componentDidMount(): Promise<void> {
    const axiosInstance = axios.create({ timeout: 5000 });
    const resp = await axiosInstance.get(GITHUB_API_URL);

    if (resp.status !== 200) {
      return;
    }
    if (!resp.data.assets || !resp.data.assets.length) {
      return;
    }

    const packages = { mac: "", linux: "", window: "" };
    // @ts-ignore
    resp.data.assets.forEach(item => {
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
      if (packages.mac) {
        this.setState({ downloadLink: packages.mac });
      }
    } else if (
      osName === "Ubuntu" ||
      osName === "Debian" ||
      osName === "Fedora" ||
      osName === "Red Hat" ||
      osName === "SuSE"
    ) {
      if (packages.linux) {
        this.setState({ downloadLink: packages.linux });
      }
    } else if (osName.indexOf("Windows") !== -1 && osName !== "Windows Phone") {
      if (packages.window) {
        this.setState({ downloadLink: packages.window });
      }
    }
  }

  public render(): JSX.Element {
    const { visible, closeModal } = this.props;
    const { downloadLink } = this.state;
    return (
      <Modal
        title={
          <div style={{ textAlign: "center" }}>{t("signin_modal.wallet")}</div>
        }
        visible={visible}
        onCancel={closeModal}
        footer={null}
      >
        <div style={{ textAlign: "center" }}>
          <Button key="switch" width="80%" onClick={closeModal}>
            {t("signin_modal.sign_in")}
          </Button>
        </div>
        <div
          style={{ textAlign: "center", fontSize: "18px", padding: "20px 0" }}
        >
          <a href={downloadLink}>{t("signin_modal.download")}</a>
        </div>
      </Modal>
    );
  }
}

export { SignInModal };
