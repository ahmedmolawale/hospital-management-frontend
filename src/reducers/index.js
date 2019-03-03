import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import signIn from 'reducers/sign_in';

const rootReducer = combineReducers({
  form: formReducer,
  user: signIn
});

export default rootReducer;
