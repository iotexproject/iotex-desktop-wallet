// @ts-ignore
import {t} from 'onefx/lib/iso-i18n';
import * as React from 'react';
import {Route} from 'react-router';
import {ErrorPage} from './error-page';

export function NotFound() {
  return (
    <Status code={404}>
      <ErrorPage bar={t('not_found.bar')} title={t('not_found.title')} info={t('not_found.info')}/>
    </Status>
  );
}

const Status = ({code, children}: any) => (
  <Route
    render={({staticContext}: any) => {
      if (staticContext) {
        staticContext.status = code;
      }
      return children;
    }}
  />
);
