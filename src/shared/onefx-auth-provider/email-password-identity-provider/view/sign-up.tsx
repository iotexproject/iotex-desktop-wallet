
import serialize from 'form-serialize';
// @ts-ignore
import {t} from 'onefx/lib/iso-i18n';
// @ts-ignore
import Helmet from 'onefx/lib/react-helmet';
// @ts-ignore
import {styled} from 'onefx/lib/styletron-react';
import {Component} from 'react';
import {Link} from 'react-router-dom';

import React from 'react';
import {Button} from '../../../common/button';
import {colorHover} from '../../../common/color-hover';
import {Flex} from '../../../common/flex';
import {transition} from '../../../common/styles/style-animation';
import {colors} from '../../../common/styles/style-color';
import {fullOnPalm} from '../../../common/styles/style-media';
import {ContentPadding} from '../../../common/styles/style-padding';
import {axiosInstance} from './axios-instance';
import {EmailField} from './email-field';
import {FieldMargin} from './field-margin';
import {FormContainer} from './form-container';
import {PasswordField} from './password-field';

const LOGIN_FORM = 'signup';

type State = {
  errorEmail: string,
  errorPassword: string,

  valueEmail: string,
  valuePassword: string,
}

export class SignUp extends Component<{}, State> {
  public state: State = {
    errorEmail: '',
    errorPassword: '',

    valueEmail: '',
    valuePassword: '',
  };

  public onSubmit(e: Event):void {
    e.preventDefault();
    const el = window.document.getElementById(LOGIN_FORM) as HTMLFormElement;
    const {email = '', password = ''} = serialize(el, {hash: true}) as { email: string, password: string };
    axiosInstance.post('/api/sign-up/', {
      email,
      password,
    }).then(r => {
      if (r.data.ok && r.data.shouldRedirect) {
        return window.location.href = r.data.next;
      } else if (r.data.error) {
        const error = r.data.error;
        const errorState = {
          valueEmail: email,
          errorEmail: '',
          errorPassword: '',
        };
        switch (error.code) {
          case 'auth/email-already-in-use':
          case 'auth/invalid-email': {
            errorState.errorEmail = error.message;
            break;
          }
          default:
          case 'auth/weak-password': {
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
            <Helmet title={`Sign Up - ${t('topbar.brand')}`}/>
            <Flex column={true}>
              <h1>Create Account</h1>
              <EmailField
                error={errorEmail}
                defaultValue={valueEmail}
              />
              <PasswordField
                error={errorPassword}
                defaultValue={valuePassword}
              />
              <FieldMargin>
                <Button onClick={(e: Event) => this.onSubmit(e)} width="100%">{'SUBMIT'}</Button>
              </FieldMargin>
            </Flex>
            <FieldMargin>
              <StyleLink style={{underscore: 'none'}} to="/login/">{t('auth/sign_up.switch_to_sign_in')}</StyleLink>
            </FieldMargin>
          </Form>
        </Flex>
      </ContentPadding>
    );
  }
}

export const StyleLink = styled(Link, {
  ...colorHover(colors.brand01),
  textDecoration: 'none',
  transition,
});

const Form = styled(FormContainer, {
  width: '320px',
  ...fullOnPalm,
});

