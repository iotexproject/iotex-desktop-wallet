// @flow
import {FieldMargin} from './field-margin';
import {InputLabel} from './input-label';
import {TextInput} from './text-input';
import {InputError} from './input-error';

type Props = {
  defaultValue: string,
  error: boolean,
  onChange?: (e: any) => void,
}

export function PasswordField({defaultValue, error, onChange}: Props) {
  return (
    <FieldMargin>
      <InputLabel htmlFor='email-login-password'>Password</InputLabel>
      <TextInput
        defaultValue={defaultValue}
        onChange={onChange}
        error={error}
        type='password'
        aria-label='Password'
        id='email-login-password'
        name='password'
        placeholder='Password'
      />
      <InputError>{error || '\u0020'}</InputError>
    </FieldMargin>
  );
}
