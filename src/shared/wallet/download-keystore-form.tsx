import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Form, { FormComponentProps } from "antd/lib/form/Form";
import Modal from "antd/lib/modal";
import Row from "antd/lib/row";
import dateformat from "dateformat";
import exportFromJSON from "export-from-json";
import { encrypt } from "iotex-antenna/lib/account/wallet";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import QRCode from "qrcode.react";
import { Component } from "react";
import * as React from "react";
import { CopyButtonClipboardComponent } from "../common/copy-button-clipboard";
import { PasswordFormInputItem } from "./contract/cards";

function utcNow(): string {
  return dateformat(new Date().toUTCString(), "UTC:yyyy-mm-dd'T'HH-MM-ss.l'Z'");
}

type Props = { privateKey: string; address: string; simplify?: boolean };

class DownloadKeystoreFormInner extends Component<Props & FormComponentProps> {
  public state: { exporting: boolean } = {
    exporting: false
  };

  public onClickHanlder = () => {
    const { exporting } = this.state;
    if (exporting) {
      return;
    }
    const { privateKey, address, form } = this.props;
    this.setState({ exporting: true });
    form.validateFields((err, values) => {
      if (err) {
        this.setState({ exporting: false });
        return;
      }
      const { password } = values;
      // setTimeout here is needed to avoid UI stuck due to heavy load cause by export proccess.
      setTimeout(() => {
        exportFromJSON({
          data: encrypt(privateKey, password),
          fileName: `UTC--${utcNow()}--${address}`,
          exportType: "json"
        });
        this.setState({ exporting: false });
      }, 1);
    });
  };

  public showPrivateKey = () => {
    const { privateKey } = this.props;
    const content = (
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ marginLeft: -38 }}
      >
        <Col style={{ margin: 10 }}>
          <QRCode value={privateKey} />
        </Col>
        <Col
          style={{ wordBreak: "break-all", textAlign: "center", padding: 10 }}
        >
          {privateKey}{" "}
          <CopyButtonClipboardComponent icon="copy" text={privateKey} />
        </Col>
      </Row>
    );
    Modal.warning({
      title: t("account.save"),
      content,
      okText: t("account.claimAs.close")
    });
  };

  public render(): JSX.Element {
    const { form, simplify = false } = this.props;
    const { exporting } = this.state;
    return (
      <Form layout="vertical">
        {!simplify && (
          <div
            dangerouslySetInnerHTML={{ __html: t("new-wallet.save_keystore") }}
          />
        )}
        <PasswordFormInputItem form={form} />
        <Row type="flex" justify="start" gutter={10}>
          <Col style={{ margin: "5px 0" }}>
            <Button
              loading={exporting}
              disabled={exporting}
              onClick={this.onClickHanlder}
            >
              {t("new-wallet.download")}
            </Button>
          </Col>
          <Col style={{ margin: "5px 0" }}>
            <Button onClick={this.showPrivateKey} icon="qrcode">
              {t("new-wallet.showPrivateKey")}
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const DownloadKeystoreForm = Form.create({ name: "download-keystore-form" })(
  DownloadKeystoreFormInner
);

export { DownloadKeystoreForm };
