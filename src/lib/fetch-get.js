import fetch from 'unfetch';
import window from 'global/window';

export function fetchGet(url) {
  return fetch(
    url,
    {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': window.csrfToken,
      },
    })
    .then(resp => resp.json());
}
