// @flow
/* eslint-disable no-console,no-undef */
import {Component} from 'react';
import Helmet from 'onefx/lib/react-helmet';
import window from 'global/window';
import serialize from 'form-serialize';
import {styled} from 'onefx/lib/styletron-react';
import {t} from 'onefx/lib/iso-i18n';

import {connect} from 'react-redux';
import {fullOnPalm} from '../../../common/styles/style-media';
import {Flex} from '../../../common/flex';
import {ContentPadding} from '../../../common/styles/style-padding';
import {Button} from '../../../common/button';
import {colors} from '../../../common/styles/style-color';
import {PasswordField} from './password-field';
import {FormContainer} from './form-container';
import {FieldMargin} from './field-margin';
import {axiosInstance} from './axios-instance';
import {InputLabel} from './input-label';
import {TextInput} from './text-input';
import {InputError} from './input-error';

const LOGIN_FORM = 'reset-password';

type Props = {
  token: string,
}
type State = {
  errorPassword: string,
  errorNewPassword: string,

  valuePassword: string,
  valueNewPassword: string,

  message: string,
}

// $FlowFixMe
export const ResetPasswordContainer = connect(
  state => ({token: state.base.token})
)(
  class ResetPassword extends Component<Props, State> {
    props: Props;
    state: State;

    constructor(props: Props) {
      super(props);
      this.state = {
        errorPassword: '',
        errorNewPassword: '',

        valuePassword: '',
        valueNewPassword: '',

        message: '',
      };
    }

    onSubmit(e: SyntheticEvent<HTMLButtonElement>) {
      e.preventDefault();
      const {newPassword = '', password = '', token = ''} = serialize(window.document.getElementById(LOGIN_FORM), {hash: true});
      axiosInstance.post('/api/reset-password/', {
        password,
        newPassword,
        token,
      }).then(r => {
        if (r.data.ok) {
          this.setState({
            message: t('auth/reset_password.success'),
            errorPassword: '',
            errorNewPassword: '',
            valuePassword: '',
            valueNewPassword: '',
          });
          if (r.data.shouldRedirect) {
            return window.setInterval(() => window.location.href = r.data.next, 3000);
          }
        } else if (r.data.error) {
          const error = r.data.error;
          const errorState = {
            valuePassword: password,
            valueNewPassword: newPassword,
            errorPassword: '',
            errorNewPassword: '',
            message: '',
          };
          if (error.code === 'auth/wrong-password') {
            errorState.errorPassword = error.message;
          }
          if (error.code === 'auth/weak-password') {
            errorState.errorNewPassword = error.message;
          }

          this.setState(errorState);
        }
      });
    }

    render() {
      const {
        errorPassword,
        errorNewPassword,
        valuePassword,
        valueNewPassword,
        message,
      } = this.state;
      const {token} = this.props;
      return (
        <ContentPadding>
          <Flex minHeight='550px' center={true}>
            <Form id={LOGIN_FORM}>
              <Helmet title={`login - ${t('topbar.brand')}`}/>
              <Flex column={true}>
                <h1>{t('auth/reset_password')}</h1>
                {message && (
                  <Info>
                    <Flex with='100%'>
                      <span>{message}</span>
                      <i
                        style={{color: colors.inverse01, cursor: 'pointer'}}
                        onClick={() => this.setState({message: ''})}
                        className='fas fa-times'
                      />
                    </Flex>
                  </Info>
                )}
                {token ? (
                  <input name='token' hidden={true} defaultValue={token}/>
                ) : (
                  <PasswordField defaultValue={valuePassword} error={Boolean(errorPassword)}/>
                )}
                {!message && (
                  <FieldMargin>
                    <InputLabel>New Password</InputLabel>
                    <TextInput
                      defaultValue={valueNewPassword}
                      error={errorNewPassword}
                      type='password'
                      aria-label='New Password'
                      name='newPassword'
                      placeholder='New Password'
                    />
                    <InputError>{errorNewPassword || '\u0020'}</InputError>
                  </FieldMargin>
                )}
                {!message && (
                  <FieldMargin>
                    <Button onClick={e => this.onSubmit(e)} width='100%'>SUBMIT</Button>
                  </FieldMargin>
                )}
              </Flex>
            </Form>
          </Flex>
        </ContentPadding>
      );
    }
  });

const Form = styled(FormContainer, {
  width: '320px',
  ...fullOnPalm,
});

const Info = styled('div', {
  padding: '16px',
  width: '100%',
  backgroundColor: colors.success,
  color: colors.inverse01,
});
