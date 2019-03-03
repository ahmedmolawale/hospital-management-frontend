import axios from 'axios'
const API_KEY = ''
const BASE_URL = "http://127.0.0.1:3002/api/v1/";
const ALL_DOCTORS = 'ALL_DOCTORS';
const CREATE_DOCTOR = 'CREATE_DOCTOR';

export function fetchAllDoctors() {
    const END_POINT = "staff/doctors";
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.get(URL);
    return {
        type: ALL_DOCTORS,
        payload: request
    };
}
export function createDoctor(body) {
    const END_POINT = "staff/doctor";
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.post(URL, body);
    return {
        type: CREATE_DOCTOR,
        payload: request
    };
}
