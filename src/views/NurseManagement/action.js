import axios from 'axios'
const API_KEY = ''
const BASE_URL = "http://127.0.0.1:3002/api/v1/";
export const FREE_PATIENTS = 'free-patients';
export const ALL_PATIENTS = 'all-patients'
export const CREATE_PATIENT = 'CREATE_PATIENT'
export const SIGN_IN = 'sign-in'
const ALL_NURSES = 'ALL_NURSES';
const CREATE_NURSE = 'CREATE_NURSE';
export function signAdminIn(user) {
    const END_POINT = "auth/user/login";
    const URL = `${BASE_URL}${END_POINT}${API_KEY}`;
    const request = axios.post(URL, user);
    return {
        type: SIGN_IN,
        payload: request
    };
}

export function fetchAllNurses() {
    const END_POINT = "staff/nurses";
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.get(URL);
    return {
        type: ALL_NURSES,
        payload: request
    };
}
export function createNurse(body) {
    const END_POINT = "staff/nurse";
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.post(URL, body);
    return {
        type: CREATE_NURSE,
        payload: request
    };
}
