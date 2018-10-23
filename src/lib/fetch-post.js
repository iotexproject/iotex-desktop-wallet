import fetch from 'unfetch';
import window from 'global/window';

export function fetchPost(url, body) {
  return fetch(
    url,
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': window.csrfToken,
      },
      body: JSON.stringify(body),
    })
    .then(resp => resp.json());
}
