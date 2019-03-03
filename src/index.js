import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {
    HashRouter,
    BrowserRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import promise from 'redux-promise';
import reducers from 'reducers';

import App from 'containers/App/App.jsx';

import NurseDahboard from 'containers/NurseDashboard/App.jsx';
import DoctorDashboard from 'containers/DoctorDashboard/App.jsx';
import LabDashboard from 'containers/LabDashboard/App.jsx';
import Login from 'containers/Login/Login.jsx';

import './assets/css/bootstrap.min.css';
import './assets/css/animate.min.css';
import './assets/sass/light-bootstrap-dashboard.css';
import './assets/css/demo.css';
import './assets/css/pe-icon-7-stroke.css';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
ReactDOM.render((
    <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
        <Switch>
             <Route path='/admin' name='Home' component={App}/>
             <Route path='/nurse' name='Nurse Dashboard' component={NurseDahboard}/>
             <Route path='/lab' name='Lab Dashboard' component={LabDashboard}/>
             <Route path='/doctor' name='Doctor Dashboard' component={DoctorDashboard}/>
             <Route path='/login' name='Login' component={Login}/>
            {/*<Route path='/sign_up' exact name='OnboardingWizard' component={OnboardingWizard}/>*/}
            {/* <Route path="/banking" name="App" component={App}/> */}
            {/* <Route path='/admin/login' exact name='Admin Login' component={AdminLogin}/>
            <Route path='/admin' name='Admin App' component={AdminApp}/>
            <Route path='/institution_login' exact name='InstitutionLogin' component={InstitutionLogin}/>
            <Route path='/institution' name='InstitutionApp' component={InstitutionApp}/> */}
            {/* <Route path='/cooperate' exact name='Cooperate' component={Cooperate}/>
            <Route path='/agent' exact name='Agent' component={Agent}/> */}
            <Redirect from='*' to='/login'/>
        </Switch>
    </BrowserRouter>
    </Provider>
),document.getElementById('root'));
