import axios from "axios";
import isBrowser from "is-browser";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";

const csrfToken = isBrowser && JsonGlobal("state").base.csrfToken;

export const axiosInstance = axios.create({
  timeout: 10000,
  headers: { "x-csrf-token": csrfToken }
});
