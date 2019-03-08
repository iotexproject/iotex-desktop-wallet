import React from 'react';
import {connect} from 'react-redux';

function Form({children, csrfToken, qs, csrfInQuery, dispatch, ...otherProps}: any) {
  return (
    <form method="POST" {...otherProps}>
      <input type="hidden" name="_csrf" value={csrfToken}/>
      {children}
    </form>
  );
}

// $FlowFixMe
export const FormContainer = connect(
  state => ({
    // @ts-ignore
    csrfToken: state.base.csrfToken,
  }),
)(Form);
