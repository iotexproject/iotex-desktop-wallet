// @flow
/* eslint-disable no-console,no-undef */
import {Component} from 'react';
import Helmet from 'onefx/lib/react-helmet';
import window from 'global/window';
import serialize from 'form-serialize';
import {styled} from 'onefx/lib/styletron-react';
import {t} from 'onefx/lib/iso-i18n';

import {Flex} from '../../../common/flex';
import {Button} from '../../../common/button';
import {ContentPadding} from '../../../common/styles/style-padding';
import {fullOnPalm} from '../../../common/styles/style-media';
import {EmailField} from './email-field';
import {FieldMargin} from './field-margin';
import {FormContainer} from './form-container';
import {axiosInstance} from './axios-instance';
import {StyleLink} from './sign-up';

const FORGOT_PASSWORD_FORM = 'forgot_password';

export class ForgotPassword extends Component<*, *> {
  email: string;

  constructor(props: any) {
    super(props);
    this.state = {
      errorEmail: '',
      valueEmail: '',
      sent: false,
    };
  }

  onSubmit(e: any) {
    e.preventDefault();
    const {email = ''} = serialize(window.document.getElementById(FORGOT_PASSWORD_FORM), {hash: true});
    this.email = email;
    axiosInstance.post('/api/forgot-password/', {
      email,
    }).then(r => {
      if (r.data.ok) {
        this.setState({sent: true});
        return;
      } else if (r.data.error) {
        const error = r.data.error;
        const errorState = {
          valueEmail: email,
          errorEmail: '',
        };
        if (error.code === 'auth/invalid-email') {
          errorState.errorEmail = error.message;
        }
        this.setState(errorState);
      }
    });
  }

  render() {
    const {
      errorEmail,
      valueEmail,
      sent,
    } = this.state;
    return (
      <ContentPadding>
        <Flex minHeight='550px' center={true}>
          <Form id={FORGOT_PASSWORD_FORM}>
            <Helmet title={`${t('auth/forgot_password')} - ${t('meta.title')}`}/>

            {
              sent ? (
                <Flex column={true}>
                  <h1>{t('auth/forgot_password')}</h1>
                  <p>{t('auth/forgot_password.sent', {email: this.email})}</p>
                </Flex>
              ) : (
                <Flex column={true}>
                  <h1>{t('auth/forgot_password')}</h1>
                  <p>{t('auth/forgot_password.desc')}</p>
                  <EmailField
                    error={errorEmail}
                    defaultValue={valueEmail}
                  />
                  <FieldMargin>
                    <Button onClick={e => this.onSubmit(e)} width='100%'>{t('auth/forgot_password.send')}</Button>
                  </FieldMargin>
                </Flex>
              )
            }
            <FieldMargin>
              <StyleLink style={{underscore: 'none'}} to='/login/'>{t('auth/forgot_password.back')}</StyleLink>
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

