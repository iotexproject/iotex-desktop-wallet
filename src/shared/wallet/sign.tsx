import Button from "antd/lib/button";
import Form from "antd/lib/form";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { get } from "dottie";
import React, { useState } from "react";
import { MessageFormInputItem } from "./contract/cards";
import { getAntenna } from "./get-antenna";

type Props = {
  form: WrappedFormUtils;
};

export function SignInner({ form }: Props): JSX.Element {
  const msgRaw = get(window, "query.message") || "";
  const [signedMsg, setSignedMsg] = useState("");

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
            // add enumerable
            const signed = antenna.iotx.accounts.sign(
              values.message,
              "1111111111111111111111111111111111111111111111111111111111111111"
            );
            setSignedMsg(signed.toString());
          });
        }}
      />

      {signedMsg && signedMsg}
    </Form>
  );
}

export const Sign = Form.create()(SignInner);
