// @flow
import {PureComponent} from 'react';
import {t} from 'onefx/lib/iso-i18n';
import {Route} from 'react-router';
import {ErrorPage} from './error-page';

export class NotFound extends PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Status code={404}>
        <ErrorPage bar={t('not_found.bar')} title={t('not_found.title')} info={t('not_found.info')}/>
      </Status>
    );
  }
}

const Status = ({code, children}: any) => (
  <Route
    render={({staticContext}) => {
      if (staticContext) {
        staticContext.status = code;
      }
      return children;
    }}
  />
);
