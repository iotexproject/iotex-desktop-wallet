import React from "react";
import { FieldMargin } from "./field-margin";
import { InputError } from "./input-error";
import { InputLabel } from "./input-label";
import { TextInput } from "./text-input";

type Props = {
  defaultValue: string;
  error: string;
  onChange?: Function;
};

export function PasswordField({
  defaultValue,
  error,
  onChange
}: Props): JSX.Element {
  return (
    <FieldMargin>
      <InputLabel htmlFor="email-login-password">Password</InputLabel>
      <TextInput
        defaultValue={defaultValue}
        onChange={onChange}
        error={error}
        type="password"
        aria-label="Password"
        id="email-login-password"
        name="password"
        placeholder="Password"
      />
      <InputError>{error || "\u0020"}</InputError>
    </FieldMargin>
  );
}
