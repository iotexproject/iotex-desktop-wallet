/* eslint-disable no-console,no-undef */
import {Component} from 'react';
import Helmet from 'onefx/lib/react-helmet';
import window from 'global/window';
import serialize from 'form-serialize';
import {styled} from 'onefx/lib/styletron-react';
import {t} from 'onefx/lib/iso-i18n';

import {fullOnPalm} from '../../../common/styles/style-media';
import {Flex} from '../../../common/flex';
import {ContentPadding} from '../../../common/styles/style-padding';
import {Button} from '../../../common/button';
import {PasswordField} from './password-field';
import {FormContainer} from './form-container';
import {FieldMargin} from './field-margin';
import {EmailField} from './email-field';
import {axiosInstance} from './axios-instance';
import {StyleLink} from './sign-up';

const LOGIN_FORM = 'login';

export class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorEmail: '',
      errorPassword: '',

      valueEmail: '',
      valuePassword: '',
    };
  }

  onSubmit(e) {
    e.preventDefault();
    const {email = '', password = ''} = serialize(window.document.getElementById(LOGIN_FORM), {hash: true});
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
          errorEmail: '',
          errorPassword: '',
        };
        if (error.code === 'auth/invalid-email' ||
          error.code === 'auth/user-disabled' ||
          error.code === 'auth/user-not-found'
        ) {
          errorState.errorEmail = error.message;
        }
        if (error.code === 'auth/wrong-password') {
          errorState.errorPassword = error.message;
        }
        this.setState(errorState);
      }
    });
  }

  render() {
    const {
      errorEmail,
      errorPassword,
      valueEmail,
      valuePassword,
    } = this.state;
    return (
      <ContentPadding>
        <Flex minHeight='550px' center={true}>
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
                <Button onClick={e => this.onSubmit(e)} width='100%'>SUBMIT</Button>
              </FieldMargin>
            </Flex>
            <FieldMargin>
              <StyleLink to='/forgot-password'>{t('auth/sign_in.forgot_password')}</StyleLink>
            </FieldMargin>
            <FieldMargin>
              <StyleLink to='/sign-up'>{t('auth/sign_in.switch_to_sign_up')}</StyleLink>
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
