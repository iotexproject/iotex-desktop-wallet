import xhr from 'xhr/index';
import window from 'global';

export function jsonCall(data, action, request) {
  return dispatch => {
    dispatch({type: action});
    dispatch({type: 'FETCHING', payload: true});
    xhr(
      request,
      {
        method: 'POST',
        headers: {
          'x-csrf-token': window.csrfToken,
        },
        json: data,
      },
      (err, body, r) => {
        dispatch({type: 'FETCHING', payload: false});
        if (err) {
          dispatch({type: `${action}_FAIL`, payload: {error: {code: 500, message: err}}});
          return;
        }
        if (body.statusCode === 500) {
          dispatch({type: `${action}_FAIL`, payload: {error: {code: body.statusCode, message: r}}});
          return;
        }
        if (!r.ok) {
          dispatch({type: `${action}_FAIL`, payload: r});
          return;
        }
        dispatch({type: `${action}_SUCCESS`, payload: r});
      });
  };
}
