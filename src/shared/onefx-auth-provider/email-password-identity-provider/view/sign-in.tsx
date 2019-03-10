
import serialize from 'form-serialize';
// @ts-ignore
import {t} from 'onefx/lib/iso-i18n';
// @ts-ignore
import Helmet from 'onefx/lib/react-helmet';
// @ts-ignore
import {styled} from 'onefx/lib/styletron-react';
import {Component} from 'react';

import React from 'react';
import {Button} from '../../../common/button';
import {Flex} from '../../../common/flex';
import {fullOnPalm} from '../../../common/styles/style-media';
import {ContentPadding} from '../../../common/styles/style-padding';
import {axiosInstance} from './axios-instance';
import {EmailField} from './email-field';
import {FieldMargin} from './field-margin';
import {FormContainer} from './form-container';
import {PasswordField} from './password-field';
import {StyleLink} from './sign-up';

const LOGIN_FORM = 'login';

type State = {
  errorEmail: string,
  errorPassword: string,

  valueEmail: string,
  valuePassword: string,
}

export class SignIn extends Component<{},State> {
  public state: State = {
    errorEmail: '',
    errorPassword: '',

    valueEmail: '',
    valuePassword: '',
  };

  public onSubmit(e: Event): void {
    e.preventDefault();
    const el = window.document.getElementById(LOGIN_FORM) as HTMLFormElement;
    if (!el) {
      return;
    }
    const {email = '', password = ''} = serialize(el, {hash: true}) as {email: string, password: string};
    axiosInstance.post('/api/sign-in/', {
      email,
      password,
    }).then(r => {
      if (r.data.ok && r.data.shouldRedirect) {
        return window.location.href = r.data.next;
      } else if (r.data.error) {
        const error = r.data.error;
        const errorState = {
          valueEmail: email,
          valuePassword: this.state.valuePassword,
          errorEmail: '',
          errorPassword: '',
        };
        switch (error.code) {
          case 'auth/invalid-email':
          case 'auth/user-disabled':
          case 'auth/user-not-found': {
            errorState.errorEmail = error.message;
            break;
          }
          default:
          case 'auth/wrong-password': {
            errorState.errorPassword = error.message;
          }
        }
        this.setState(errorState);
      }
    });
  }

  public render(): JSX.Element {
    const {
      errorEmail,
      errorPassword,
      valueEmail,
      valuePassword,
    } = this.state;
    return (
      <ContentPadding>
        <Flex minHeight="550px" center={true}>
          <Form id={LOGIN_FORM}>
            <Helmet title={`login - ${t('topbar.brand')}`}/>
            <Flex column={true}>
              <h1>{t('auth/sign_in.title')}</h1>
              <EmailField
                error={errorEmail}
                defaultValue={valueEmail}
              />
              <PasswordField
                error={errorPassword}
                defaultValue={valuePassword}
              />
              <FieldMargin>
                <Button onClick={(e: Event) => this.onSubmit(e)} width="100%">SUBMIT</Button>
              </FieldMargin>
            </Flex>
            <FieldMargin>
              <StyleLink to="/forgot-password">{t('auth/sign_in.forgot_password')}</StyleLink>
            </FieldMargin>
            <FieldMargin>
              <StyleLink to="/sign-up">{t('auth/sign_in.switch_to_sign_up')}</StyleLink>
            </FieldMargin>
          </Form>
        </Flex>
      </ContentPadding>
    );
  }
}

const Form = styled(FormContainer, {
  width: '320px',
  ...fullOnPalm,
});
