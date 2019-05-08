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

type Props = { privateKey: string; address: string };

class DownloadKeystoreFormInner extends Component<Props & FormComponentProps> {
  public render(): JSX.Element {
    const { privateKey, address, form } = this.props;
    return (
      <Form layout="vertical">
        <div
          dangerouslySetInnerHTML={{ __html: t("new-wallet.save_keystore") }}
        />

        <PasswordFormInputItem form={form} />

        {/*
      // @ts-ignore*/}
        <Button
          type="primary"
          onClick={() => {
            form.validateFields((err, values) => {
              if (err) {
                return;
              }
              const { password } = values;
              exportFromJSON({
                data: encrypt(privateKey, password),
                fileName: `UTC--${utcNow()}--${address}`,
                exportType: "json"
              });
            });
          }}
        >
          {t("new-wallet.download")}
        </Button>
      </Form>
    );
  }
}

const DownloadKeystoreForm = Form.create({ name: "download-keystore-form" })(
  DownloadKeystoreFormInner
);

export { DownloadKeystoreForm };
