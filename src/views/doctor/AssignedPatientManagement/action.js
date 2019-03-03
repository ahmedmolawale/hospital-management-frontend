import axios from 'axios'
// const BASE_URL = "http://127.0.0.1:3002/api/v1/";
const BASE_URL = "https://api-dssmc.herokuapp.com/api/v1/";
const ASSIGNED_PATIENTS = 'ASSIGNED_PATIENTS';
const DOCTORS = 'DOCTORS'
const RECORD_VITALS = 'RECORD_VITALS';
const GET_PATIENT_INFO = 'GET_PATIENT_INFO'
const SAVE_MEDICAL_RECORD = 'SAVE_MEDICAL_RECORD';
const LABS_ATTENDANT = 'LABS_ATTENDANT';
const ASSIGN_PATIENT_LAB = 'ASSIGN_PATIENT_LAB';
const GET_LAB_RESULTS = 'GET_LAB_RESULTS';

export function fetchAssignedPatients(staffId) {
    const END_POINT = `doctor/${staffId}/assigned-patients`;
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.get(URL);
    return {
        type: ASSIGNED_PATIENTS,
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
export function loadLabResults(patientId) {
    const END_POINT = `patient/${patientId}/get-lab-result`;
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.get(URL);
    return {
        type: GET_LAB_RESULTS,
        payload: request
    };
}

export function fetchLabAttendants() {
    const END_POINT = `staff/lab-attendants`;
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.get(URL);
    return {
        type: LABS_ATTENDANT,
        payload: request
    };
}
export function getInfoOnPatient(staffId) {
    const END_POINT = `patient/${staffId}/medical-records`;
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.get(URL);
    return {
        type: GET_PATIENT_INFO,
        payload: request
    };
}

export function assignPatientToLab(body) {
    const END_POINT = "patient/assign-lab";
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.post(URL, body);
    return {
        type: ASSIGN_PATIENT_LAB,
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


export function saveMedicalRecord(body){
    const END_POINT = `patient/medical-records`;
    const URL = `${BASE_URL}${END_POINT}`;
    const request = axios.post(URL, body);
    return {
        type: SAVE_MEDICAL_RECORD,
        payload: request
    };
}



