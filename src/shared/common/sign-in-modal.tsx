import { Modal } from "antd";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { Button } from "./button";

import axios from "axios";
// @ts-ignore
import platform from "platform";
import React from "react";
import { Component } from "react";
import { colors } from "./styles/style-color";

const apiUrl =
  "https://api.github.com/repos/iotexproject/iotex-explorer/releases/latest";

type Props = {
  visible: boolean;
  closeModal(): void;
};
type State = {
  downloadLink: string;
};

class SignInModal extends Component<Props, State> {
  public state: State = {
    downloadLink: "https://github.com/iotexproject/iotex-explorer/releases"
  };

  public async componentDidMount(): Promise<void> {
    const axiosInstance = axios.create({ timeout: 5000 });
    const resp = await axiosInstance.get(apiUrl);

    const packages = { mac: "", linux: "", window: "" };
    if (resp.status === 200 && resp.data.assets) {
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
      } else if (
        osName.indexOf("Windows") !== -1 &&
        osName !== "Windows Phone"
      ) {
        if (packages.window) {
          this.setState({ downloadLink: packages.window });
        }
      }
    }
  }

  public render(): JSX.Element {
    const { visible, closeModal } = this.props;
    const { downloadLink } = this.state;
    return (
      <Modal
        title={<b>{t("signin_modal.wallet")}</b>}
        visible={visible}
        onCancel={closeModal}
        footer={[
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button key="switch" secondary width="210px" onClick={closeModal}>
              {t("signin_modal.sign_in")}
            </Button>
            <Button key="logout" width="250px">
              <a style={{ color: colors.white }} href={downloadLink}>
                {t("signin_modal.download")}
              </a>
            </Button>
          </div>
        ]}
      />
    );
  }
}

export { SignInModal };
