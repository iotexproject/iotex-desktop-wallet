import axios from 'axios';
import JsonGlobal from 'safe-json-globals/get';
import isBrowser from 'is-browser';

const csrfToken = isBrowser && JsonGlobal('state').base.csrfToken;

export const axiosInstance = axios.create({
  timeout: 10000,
  headers: {'x-csrf-token': csrfToken},
});
