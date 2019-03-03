import axios from 'axios'
// const BASE_URL = "http://127.0.0.1:3002/api/v1/";
const BASE_URL = "https://api-dssmc.herokuapp.com/api/v1/";
const ASSIGNED_PATIENTS = 'ASSIGNED_PATIENTS';
const RECORD_LAB_RESULT = 'RECORD_LAB_RESULT';
const DOCTORS = 'DOCTORS'
const RECORD_VITALS = 'RECORD_VITALS';


export function fetchAssignedPatients(staffId) {
    const END_POINT = `nurse/${staffId}/assigned-patients`;
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.get(URL);
    return {
        type: ASSIGNED_PATIENTS,
        payload: request
    };
}
export function recordResult(body) {
    const END_POINT = `lab/record-lab-result`;
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.post(URL, body);
    return {
        type: RECORD_LAB_RESULT,
        payload: request
    };
}
export function fetchDoctors(staffId) {
    const END_POINT = `staff/doctors`;
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.get(URL);
    return {
        type: DOCTORS,
        payload: request
    };
}
export function recordVitals(body) {
    const END_POINT = `nurse/record-vitals`;
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.post(URL, body);
    return {
        type: RECORD_VITALS,
        payload: request
    };
}



