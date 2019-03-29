import axios from 'axios'
const API_KEY = ''
 const BASE_URL = "http://127.0.0.1:3002/api/v1/";
//const BASE_URL = "https://api-dssmc.herokuapp.com/api/v1/";
export const FREE_PATIENTS = 'free-patients';
export const ALL_PATIENTS = 'all-patients'
export const CREATE_PATIENT = 'CREATE_PATIENT'
export const SIGN_IN = 'sign-in'
const ALL_NURSES = 'ALL_NURSES';
const ASSIGN_PATIENT = 'ASSIGN_PATIENT';
export function signAdminIn(user) {
    const END_POINT = "auth/user/login";
    const URL = `${BASE_URL}${END_POINT}${API_KEY}`;
    const request = axios.post(URL, user);
    return {
        type: SIGN_IN,
        payload: request
    };
}

export function fetchFreePatients() {
    const END_POINT = "patiens/available";
    const URL = `${BASE_URL}${END_POINT}${API_KEY}`;
    const request = axios.get(URL);
    return {
        type: FREE_PATIENTS,
        payload: request
    };
}

export function fetchAllPatients() {
    const END_POINT = "patients/all";
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.get(URL);
    return {
        type: ALL_PATIENTS,
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
export function createPatient(body) {
    const END_POINT = "patients";
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.post(URL, body);
    return {
        type: CREATE_PATIENT,
        payload: request
    };
}
export function assignPatient(body) {
    const END_POINT = "patient/assign-nurse";
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.post(URL, body);
    return {
        type: ASSIGN_PATIENT,
        payload: request
    };
}
