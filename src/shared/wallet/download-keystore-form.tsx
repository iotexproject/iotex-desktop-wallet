import Button from "antd/lib/button";
import Form, { FormComponentProps } from "antd/lib/form/Form";
import dateformat from "dateformat";
import exportFromJSON from "export-from-json";
import { encrypt } from "iotex-antenna/lib/account/wallet";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import * as React from "react";
import { Component } from "react";
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

        {/*
      // @ts-ignore*/}
        <Button
          loading={exporting}
          disabled={exporting}
          onClick={this.onClickHanlder}
        >
          {t("new-wallet.export_keystore")}
        </Button>
      </Form>
    );
  }
}

const DownloadKeystoreForm = Form.create({ name: "download-keystore-form" })(
  DownloadKeystoreFormInner
);

export { DownloadKeystoreForm };
