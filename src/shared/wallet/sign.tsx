import Button from "antd/lib/button";
import Form from "antd/lib/form";
import { WrappedFormUtils } from "antd/lib/form/Form";
import TextArea from "antd/lib/input/TextArea";
import { get } from "dottie";
// @ts-ignore
import window from "global/window";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { useState } from "react";
import { MessageFormInputItem } from "./contract/cards";
import { getAntenna } from "./get-antenna";

type Props = {
  form: WrappedFormUtils;

  messageToSign?: string;
  reqId?: number;

  fromAddress: string;
};

export function SignInner({
  form,
  messageToSign,
  fromAddress,
  reqId
}: Props): JSX.Element {
  const [signedMsg, setSignedMsg] = useState("");
  const msgRaw = messageToSign || get(window, "query.message") || "";

  return (
    <Form>
      <MessageFormInputItem form={form} initialValue={String(msgRaw)} />
      {/*
        // @ts-ignore */}
      <Button
        type="primary"
        onClick={() => {
          form.validateFields((err, values) => {
            if (err) {
              return;
            }
            const antenna = getAntenna();
            const acct = antenna.iotx.accounts.getAccount(fromAddress);
            // add enumerable
            const signed = antenna.iotx.accounts.sign(
              values.message,
              (acct && acct.privateKey) || ""
            );
            if (reqId !== undefined) {
              window.signed(reqId, signed.toString("hex"));
            }
            setSignedMsg(signed.toString("hex"));
          });
        }}
      >
        {t("wallet.button.sign")}
      </Button>

      {signedMsg && <TextArea autosize={true} defaultValue={signedMsg} />}
    </Form>
  );
}

export const Sign = Form.create()(SignInner);
