import { Divider } from "antd";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Button } from "../common/button";
import { CommonMargin } from "../common/common-margin";
import { Flex } from "../common/flex";
import { ResetPasswordContainer } from "../onefx-auth-provider/email-password-identity-provider/view/reset-password";

export function Settings(): JSX.Element {
  return (
    <Flex width="100%" column={true} alignItems="flex-start">
      <h1>{t("profile.settings")}</h1>
      <CommonMargin />

      <Divider orientation="left">{t("auth/reset_password")}</Divider>

      <ResetPasswordContainer />

      <Divider />

      <div>
        <Button secondary={true} href="/logout">
          {t("auth/sign_out")}
        </Button>
      </div>
    </Flex>
  );
}
