import {t} from 'onefx/lib/iso-i18n';
import {Divider} from 'antd';
import {ResetPasswordContainer} from '../onefx-auth-provider/email-password-identity-provider/view/reset-password';
import {Flex} from '../common/flex';
import {CommonMargin} from '../common/common-margin';
import {Button} from '../common/button';

export function Settings() {
  return (
    <Flex width='100%' column={true} alignItems='flex-start'>
      <h1>{t('profile.settings')}</h1>
      <CommonMargin/>

      <Divider orientation='left'>{t('auth/reset_password')}</Divider>

      <ResetPasswordContainer hideTitle={true}/>

      <Divider/>

      <div>
        <Button secondary={true} href='/logout'>{t('auth/sign_out')}</Button>
      </div>
    </Flex>
  );
}
