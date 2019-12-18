import serialize from "form-serialize";
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import { Component } from "react";

import Button from "antd/lib/button";
import React from "react";
import { Flex } from "../../../common/flex";
import { fullOnPalm } from "../../../common/styles/style-media";
import { ContentPadding } from "../../../common/styles/style-padding";
import { axiosInstance } from "./axios-instance";
import { EmailField } from "./email-field";
import { FieldMargin } from "./field-margin";
import { FormContainer } from "./form-container";
import { StyleLink } from "./sign-up";

const FORGOT_PASSWORD_FORM = "forgot_password";

type State = {
  errorEmail: string;
  valueEmail: string;
  sent: boolean;
  disableButton: boolean;
};

export class ForgotPassword extends Component<{}, State> {
  public email: string = "";

  constructor(props: {}) {
    super(props);
    this.state = {
      errorEmail: "",
      valueEmail: "",
      sent: false,
      disableButton: false
    };
  }

  public onSubmit(e: Event): void {
    e.preventDefault();
    const el = window.document.getElementById(
      FORGOT_PASSWORD_FORM
    ) as HTMLFormElement;
    if (!el) {
      return;
    }
    const { email = "" } = serialize(el, { hash: true }) as { email: string };
    this.email = email;
    this.setState({
      disableButton: true,
      valueEmail: email
    });
    axiosInstance
      .post("/api/forgot-password/", {
        email
      })
      .then(r => {
        if (r.data.ok) {
          this.setState({ sent: true });

          return;
        } else if (r.data.error) {
          const error = r.data.error;
          const errorState = {
            valueEmail: email,
            errorEmail: "",
            disableButton: false
          };
          if (error.code === "auth/invalid-email") {
            errorState.errorEmail = error.message;
          }
          this.setState(errorState);
        }
      })
      .catch(err => {
        window.console.error(`failed to post forgot password: ${err}`);
      });
  }

  public render(): JSX.Element {
    const { errorEmail, valueEmail, sent } = this.state;

    return (
      <ContentPadding>
        <Flex minHeight="550px" center={true}>
          <Form id={FORGOT_PASSWORD_FORM}>
            <Helmet
              title={`${t("auth/forgot_password")} - ${t("meta.title")}`}
            />

            {sent ? (
              <Flex column={true}>
                <h1>{t("auth/forgot_password")}</h1>
                <p>{t("auth/forgot_password.sent", { email: this.email })}</p>
              </Flex>
            ) : (
              <Flex column={true}>
                <h1>{t("auth/forgot_password")}</h1>
                <p>{t("auth/forgot_password.desc")}</p>
                <EmailField error={errorEmail} defaultValue={valueEmail} />
                <FieldMargin>
                  <Button
                    type="primary"
                    htmlType="submit"
                    // @ts-ignore
                    onClick={(e: Event) => this.onSubmit(e)}
                    style={{ width: "100%" }}
                    size="large"
                    loading={this.state.disableButton}
                  >
                    {t("auth/forgot_password.send")}
                  </Button>
                </FieldMargin>
              </Flex>
            )}
            <FieldMargin>
              <StyleLink to="/login/">
                {t("auth/forgot_password.back")}
              </StyleLink>
            </FieldMargin>
          </Form>
        </Flex>
      </ContentPadding>
    );
  }
}

const Form = styled(FormContainer, {
  width: "320px",
  ...fullOnPalm
});
