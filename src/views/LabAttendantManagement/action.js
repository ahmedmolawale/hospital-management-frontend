import axios from 'axios'
const API_KEY = ''
//const BASE_URL = "https://api-dssmc.herokuapp.com/api/v1/";
 const BASE_URL = "http://127.0.0.1:3002/api/v1/";
export const FREE_PATIENTS = 'free-patients';
export const ALL_PATIENTS = 'all-patients'
export const CREATE_LAB_ATTENDANT = 'CREATE_LAB_ATTENDANT'
export const SIGN_IN = 'sign-in'
const ALL_LAB_ATTENDANT = 'ALL_LAB_ATTENDANT';

export function signAdminIn(user) {
    const END_POINT = "auth/user/login";
    const URL = `${BASE_URL}${END_POINT}${API_KEY}`;
    const request = axios.post(URL, user);
    return {
        type: SIGN_IN,
        payload: request
    };
}

export function fetchAllLabAttendant() {
    const END_POINT = "staff/lab-attendants";
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.get(URL);
    return {
        type: ALL_LAB_ATTENDANT,
        payload: request
    };
}
export function createLabAttendant(body) {
    const END_POINT = "staff/lab-attendant";
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.post(URL, body);
    return {
        type: CREATE_LAB_ATTENDANT,
        payload: request
    };
}
