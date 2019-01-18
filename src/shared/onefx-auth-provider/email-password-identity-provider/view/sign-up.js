/* eslint-disable no-console,no-undef */
import {Component} from 'react';
import Helmet from 'onefx/lib/react-helmet';
import window from 'global/window';
import serialize from 'form-serialize';
import {styled} from 'onefx/lib/styletron-react';
import {Link} from 'react-router-dom';
import {t} from 'onefx/lib/iso-i18n';

import {Flex} from '../../../common/flex';
import {Button} from '../../../common/button';
import {ContentPadding} from '../../../common/styles/style-padding';
import {fullOnPalm} from '../../../common/styles/style-media';
import {colors} from '../../../common/styles/style-color';
import {transition} from '../../../common/styles/style-animation';
import {colorHover} from '../../../common/color-hover';
import {EmailField} from './email-field';
import {FieldMargin} from './field-margin';
import {FormContainer} from './form-container';
import {PasswordField} from './password-field';
import {axiosInstance} from './axios-instance';

const LOGIN_FORM = 'signup';

export class SignUp extends Component {
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
        if (error.code === 'auth/email-already-in-use' ||
          error.code === 'auth/invalid-email'
        ) {
          errorState.errorEmail = error.message;
        }
        if (error.code === 'auth/weak-password') {
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
                <Button onClick={e => this.onSubmit(e)} width='100%'>SUBMIT</Button>
              </FieldMargin>
            </Flex>
            <FieldMargin>
              <StyleLink style={{underscore: 'none'}} to='/login/'>{t('auth/sign_up.switch_to_sign_in')}</StyleLink>
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

