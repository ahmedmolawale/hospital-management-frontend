import axios from 'axios'
// const BASE_URL = "http://127.0.0.1:3002/api/v1/";
const BASE_URL = "https://api-dssmc.herokuapp.com/api/v1/";
const LOGIN = 'LOGIN';
export const USER = 'user';

export function login(body) {
    const END_POINT = "staff/login";
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.post(URL, body);
    return {
        type: LOGIN,
        payload: request
    };
}
export function sendUserToAllComponents(user) {
  return {
    type: USER,
    payload: user
  };
}
