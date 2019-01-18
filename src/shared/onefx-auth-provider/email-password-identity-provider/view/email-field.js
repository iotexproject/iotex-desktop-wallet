// @flow
import {FieldMargin} from './field-margin';
import {InputLabel} from './input-label';
import {TextInput} from './text-input';
import {InputError} from './input-error';

type Props = {
  error: string,
  defaultValue: string,
};

export function EmailField({error, defaultValue}: Props) {
  return (
    <FieldMargin>
      <InputLabel htmlFor='email'>Email</InputLabel>
      <TextInput
        defaultValue={defaultValue}
        id='email'
        type='email'
        aria-label='email'
        name='email'
        placeholder='email@example.com'
        required={true}
        error={error}
      />
      <InputError>{error || '\u0020'}</InputError>
    </FieldMargin>
  );
}
