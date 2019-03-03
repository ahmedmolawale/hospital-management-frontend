
import { USER } from 'containers/Login/action.js';

const INITIAL_STATE = [];
export default function(state =INITIAL_STATE , action){
    switch(action.type){
        case USER:
            return action.payload;
        default:
            return state;
    }
} 